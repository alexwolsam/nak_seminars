// src/controllers/enrollment-controller.ts
import { Request, Response } from "express";
import { EnrollmentService } from "../services/enrollment-service";

export const EnrollmentController = {
  enroll: async (req: Request, res: Response) => {
    try {
      const seminarId = Number(req.params.id);
      const userId = req.header("x-user-id") ?? "";
      const userName = req.header("x-user-name") ?? "";
      const email = req.header("x-user-email") ?? "";
      if (userId === "") return res.status(400).json({ error: "no user" });
      if (userName === "")
        return res.status(400).json({ error: "no user name" });
      if (email === "") return res.status(400).json({ error: "no email" });
      const result = await EnrollmentService.enroll(
        seminarId,
        userId,
        userName,
        email
      );
      res.json(result);
    } catch (e: any) {
      if (e.message === "seminar_not_found")
        return res.status(404).json({ error: "seminar_not_found" });
      console.log(e);
      res.status(400).json({ error: e.message || "bad_request" });
    }
  },

  leave: async (req: Request, res: Response) => {
    try {
      const seminarId = Number(req.params.id);
      const userId = req.header("x-user-id") ?? "";
      const userName = req.header("x-user-name") ?? "";
      const email = req.header("x-user-email") ?? "";
      if (userId === "") return res.status(400).json({ error: "no user" });
      if (userName === "")
        return res.status(400).json({ error: "no user name" });
      if (email === "") return res.status(400).json({ error: "no email" });
      const result = await EnrollmentService.leave(
        seminarId,
        userId,
        userName,
        email
      );
      res.json(result);
    } catch (e: any) {
      if (e.message === "not_enrolled")
        return res.status(404).json({ error: "not_enrolled" });
      res.status(400).json({ error: e.message || "bad_request" });
    }
  },

  mine: async (req: Request, res: Response) => {
    const userId = req.header("x-user-id") ?? "";
    const rows = await EnrollmentService.myEnrollments(userId);
    res.json(rows);
  },

  bySeminar: async (req: Request, res: Response) => {
    const seminarId = Number(req.params.id);
    const rows = await EnrollmentService.listBySeminar(seminarId);
    res.json(rows);
  },
};
