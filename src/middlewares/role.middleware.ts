import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new AppError("Not authenticated", 401);
    }

    if (!user.role) {
      throw new AppError("Role not found in token", 403);
    }

    if (!roles.includes(user.role)) {
      throw new AppError("Access denied", 403);
    }

    next();
  };
};