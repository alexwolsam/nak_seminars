import { Request, Response } from "express";
import { SeminarService } from "../services/seminar-service";

export const SeminarController = {
  getAll: async (_req: Request, res: Response) => {
    const seminars = await SeminarService.getAll();
    return res.json(seminars);
  },

  getById: async (req: Request, res: Response) => {
    const seminar = await SeminarService.getById(Number(req.params.id));
    if (!seminar) return res.status(404).json({ error: "Seminar not found" });
    return res.json(seminar);
  },

  create: async (req: Request, res: Response) => {
    const { title, available, deadline } = req.body;
    const newSeminar = await SeminarService.create(
      title,
      available ?? 0,
      new Date(deadline)
    );
    return res.status(201).json(newSeminar);
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await SeminarService.update(
        Number(req.params.id),
        req.body
      );
      return res.json(updated);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await SeminarService.remove(Number(req.params.id));
      return res.status(204).send();
    } catch {
      return res.status(404).json({ error: "Seminar not found" });
    }
  },
};
