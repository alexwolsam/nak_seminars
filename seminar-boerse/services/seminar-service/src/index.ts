import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health-routes";
import seminarRoutes from "./routes/seminar-routes";
import enrollmentRoutes from "./routes/enrollment-routes";
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Request: ${req.method} ${req.url}`
  );
  next();
});

// Routen mounten
app.use("/health", healthRoutes);
app.use("/", seminarRoutes);
app.use("/enrollments", enrollmentRoutes);
// Fallback
app.use((_req, res) =>
  res.status(404).json({ error: "Not Found" + _req.originalUrl })
);

app.listen(PORT, () => {
  console.log(`🎓 Seminar-Service läuft auf Port ${PORT}`);
});
