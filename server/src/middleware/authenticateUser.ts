import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer=")) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const token = authHeader.split("=")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, payload) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid access token" });
    }

    req.userId = (payload as JwtPayload).userId;

    next();
  });
}
