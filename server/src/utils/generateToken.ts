import jwt from "jsonwebtoken";

export function generateAccessToken({ userId }: { userId: string }) {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  return accessToken;
}

export function generateRefreshToken({ userId }: { userId: string }) {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return refreshToken;
}
