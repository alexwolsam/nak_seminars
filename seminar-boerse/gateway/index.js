import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import cors from "cors";

const app = express();
app.use(cors());

const SEMINAR_URL =
  process.env.UPSTREAM_SEMINAR || "http://seminar-service:3000";
const NOTIFICATION_URL =
  process.env.UPSTREAM_NOTIFICATIONS || "http://notification:3001";
// Keycloak Config
const issuer = process.env.OIDC_ISSUER;
const audience = process.env.OIDC_AUDIENCE || "account";
const jwksUri = process.env.OIDC_JWKS_URI;

// JWKS Client für Keycloak Public Keys
const client = jwksClient({ jwksUri });

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Middleware: JWT validieren und Userdaten in Header schreiben
async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, getKey, { audience, issuer }, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ error: "Token verification error" });
    }
    // ggf. Infos in Header/req packen
    req.headers["x-user-roles"] = decoded["realm_access"].roles;
    req.headers["x-user-id"] = decoded.sub;
    req.headers["x-user-name"] = decoded.given_name;
    req.headers["x-user-email"] = decoded.email;
    next();
  });
}
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Request: ${req.method} ${req.url}`
  );
  next();
});
// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Proxy zu Seminar-Service (auth nötig)
app.use(
  "/seminars",
  authMiddleware,
  createProxyMiddleware({
    target: SEMINAR_URL,
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use(
  "/notifications",
  authMiddleware,
  createProxyMiddleware({
    target: NOTIFICATION_URL,
    changeOrigin: true,
    logLevel: "debug",
  })
);

app.use((req, res) => {
  console.log(`Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found" + req.originalUrl });
});
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Gateway läuft auf Port ${port}`);
});
