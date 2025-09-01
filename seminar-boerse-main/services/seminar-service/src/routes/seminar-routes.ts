import { Router } from "express";
import { SeminarController } from "../controllers/seminar-controller";
import { requireRole } from "../middleware/requireRoleMiddleware";

const router = Router();

router.get("/", SeminarController.getAll);
router.get("/:id", SeminarController.getById);
router.post("/", requireRole("seminar-admin"), SeminarController.create);
router.put("/:id", requireRole("seminar-admin"), SeminarController.update);
router.delete("/:id", requireRole("seminar-admin"), SeminarController.remove);

export default router;
