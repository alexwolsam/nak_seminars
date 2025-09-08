import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment-controller";

const router = Router();

router.post("/:id", (req, res) => EnrollmentController.enroll(req, res));
router.delete("/:id", (req, res) => EnrollmentController.leave(req, res));
router.get("/mine", (req, res) => EnrollmentController.mine(req, res));

export default router;
