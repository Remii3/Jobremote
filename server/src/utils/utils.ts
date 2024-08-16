import { initContract } from "@ts-rest/core";
import { initServer } from "@ts-rest/express";
import { Request } from "express";
import jwt from "jsonwebtoken";

export function handleError(err: unknown, message?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export const tsServer = initServer();

export const c = initContract();

export const getDataFromToken = (req: Request) => {
  try {
    const token = req.cookies.token || "";
    if (!token) {
      return null;
    }
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken._id;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const cleanEmptyData = (data: Record<string, any>) => {
  const cleanedData: Record<string, any> = {};

  for (let i = 0; i < Object.keys(data).length; i++) {
    const key = Object.keys(data)[i];
    if (
      (typeof data[key] === "string" && data[key].trim() !== "") ||
      (Array.isArray(data[key]) && data[key].length > 0)
    ) {
      cleanedData[key] = data[key];
    }
  }
  return cleanedData;
};
