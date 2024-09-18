import { initServer } from "@ts-rest/express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function handleError(err: unknown, message?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export const tsServer = initServer();

export const getDataFromToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || "";
    if (!token) {
      return null;
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

    return decodedToken._id;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return null;
    }
    throw new Error("Invalid token");
  }
};
