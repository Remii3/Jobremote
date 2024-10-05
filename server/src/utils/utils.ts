import { initServer } from "@ts-rest/express";
import { compare, genSalt, hash } from "bcrypt";
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
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return null;
    }
    throw new Error("Invalid token");
  }
};

export function activeUntilOfferDateCalculator(pricing: string) {
  switch (pricing) {
    case "basic":
      return new Date(new Date().setMonth(new Date().getMonth() + 1));
    case "standard":
      return new Date(new Date().setMonth(new Date().getMonth() + 1));
    case "premium":
      return new Date(new Date().setMonth(new Date().getMonth() + 1));
    default:
      return null;
  }
}

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
