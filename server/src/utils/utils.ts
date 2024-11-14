import { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function handleError(err: unknown, message?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

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
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return null;
    }
    throw new Error("Invalid token");
  }
};

export async function genPassword(plainPassword: string) {
  const salt = await genSalt(10);
  return await hash(plainPassword, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
) {
  return await compare(plainPassword, hashedPassword);
}
