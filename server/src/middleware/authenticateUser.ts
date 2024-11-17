import { NextFunction, Request, Response } from "express";

import { JwtPayload, verify } from "jsonwebtoken";
import { UserPayload } from "../types/types";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  try {
    const accessToken = authHeader.split(" ")[1];
    const decoded = verify(
      accessToken,
      process.env.ACCESS_TOKEN!
    ) as JwtPayload;

    req.user = decoded as UserPayload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired." });
    }
    return res.status(403).json({ msg: "Forbidden" });
  }
}
