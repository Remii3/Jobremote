import { model, Schema } from "mongoose";

const TokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const Token = model("Token", TokenSchema);
