import { model, Schema, Types } from "mongoose";
import { z } from "zod";
import { comparePassword, genPassword } from "../utils/utils";
import { UserSchema as ContractUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";

const UserSchema = ContractUserSchema.omit({ _id: true }).extend({
  _id: z.instanceof(Types.ObjectId),
});

export type UserType = z.infer<typeof UserSchema>;

const userSchema = new Schema<UserType>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    privacyPolicyConsent: { type: Boolean, required: true },
    commercialConsent: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number },
    lockCount: { type: Number, default: 0 },
    banned: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    appliedToOffers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.virtual("createdOffers", {
  ref: "Offer",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

userSchema.methods.isBanned = function () {
  return this.banned;
};

userSchema.methods.incLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5 && !this.isLocked()) {
    this.lockUntil = Date.now() + 60 * 60 * 1000;
    this.loginAttempts = 0; // Reset after locking the user
    this.lockCount += 1;
  }

  if (this.lockCount >= 3) {
    this.banned = true; // Ban the user after 3 lockouts
  }
  await this.save();

  return this;
};

userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lockCount = 0;
  return await this.save();
};

userSchema.methods.setPassword = async function (plainPassword: string) {
  const hashedPassword = await genPassword(plainPassword);
  this.password = hashedPassword;
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  this.lockUntil = undefined;
  this.banned = false;
  this.lockCount = 0;
  await this.save();
};

userSchema.methods.validatePassword = async function (plainPassword: string) {
  return await comparePassword(plainPassword, this.password);
};

export const User = model<UserType>("User", userSchema);
