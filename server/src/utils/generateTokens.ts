import jwt from "jsonwebtoken";
import { Token } from "../models/Token.model";

export function generateAccessToken(userId: string) {
  const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN!, {
    expiresIn: "30s",
  });

  return accessToken;
}

export async function generateRefreshToken(userId: string) {
  const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN!, {
    expiresIn: "7d",
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await Token.create({ token: refreshToken, userId, expiresAt });

  return refreshToken;
}

export function generateTokens(userId: string) {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
}
