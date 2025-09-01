import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health-routes";
import seminarRoutes from "./routes/seminar-routes";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Routen mounten
app.use("/health", healthRoutes);
app.use("/seminars", seminarRoutes);

// Fallback
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(PORT, () => {
  console.log(`🎓 Seminar-Service läuft auf Port ${PORT}`);
});
