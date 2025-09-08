import { Request, Response, NextFunction } from "express";

/**
 * Middleware, die prüft ob der User eine bestimmte Rolle hat.
 * Erwartet die Rollen im Header "x-user-roles" (gesetzt durch Gateway).
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const roles = req.header("x-user-roles")?.split(",") ?? [];

    if (!roles.includes(role)) {
      return res.status(403).json({
        error: `Forbidden: role '${role}' required`,
      });
    }

    next();
  };
}
