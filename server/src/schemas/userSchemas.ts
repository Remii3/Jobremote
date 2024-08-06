import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  privacyPolicyConsent: z.boolean(),
  commercialConsent: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  loginAttempts: z.number(),
  lockUntil: z.number().optional(),
  isLocked: z.function(),
  lockCount: z.number(),
  banned: z.boolean(),
  isBanned: z.function(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.number().optional(),
});

export const PublicUserSchema = UserSchema.pick({
  email: true,
  createdAt: true,
  updatedAt: true,
  _id: true,
  commercialConsent: true,
});

export const LoginUserSchema = UserSchema.pick({
  email: true,
  password: true,
});

export const RegisterUserSchema = UserSchema.pick({
  email: true,
  password: true,
  commercialConsent: true,
  privacyPolicyConsent: true,
}).extend({
  passwordRepeat: z.string().min(6),
});
export const ChangeUserPasswordSchema = RegisterUserSchema.pick({
  password: true,
  passwordRepeat: true,
}).extend({
  resetToken: z.string().optional(),
});
export const ChangeUserPasswordSchemaRefined =
  ChangeUserPasswordSchema.superRefine((data, ctx) => {
    if (data.password !== data.passwordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["passwordRepeat"],
      });
    }
  });
export const RegisterUserSchemaRefined = RegisterUserSchema.superRefine(
  (data, ctx) => {
    if (data.password !== data.passwordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["passwordRepeat"],
      });
    }
    if (data.privacyPolicyConsent === false) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Privacy policy needs to be accepted",
        path: ["privacyPolicyConsent"],
      });
    }
  }
);
