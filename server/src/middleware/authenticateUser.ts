import { NextFunction, Request, Response } from "express";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  next();
}
