import { model, Schema } from "mongoose";
import { UserSchema } from "../schemas/userSchemas";
import { z } from "zod";

export type UserType = z.infer<typeof UserSchema>;

const userSchema = new Schema<UserType>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  privacyPolicyConsent: { type: Boolean, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  commercialConsent: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number },
  lockCount: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: String },
  createdOffers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
});

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.isBanned = function () {
  return this.banned;
};

export const User = model<UserType>("User", userSchema);
