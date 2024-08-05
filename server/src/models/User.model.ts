import { model, Schema } from "mongoose";
import { UserSchema } from "../schemas/userSchemas";
import { z } from "zod";
import { ObjectId } from "mongodb";

export type UserType = z.infer<typeof UserSchema>;

const userSchema = new Schema<UserType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privacyPolicyConsent: { type: Boolean, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

export const User = model<UserType>("User", userSchema);
