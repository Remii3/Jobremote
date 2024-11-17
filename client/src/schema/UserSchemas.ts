import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordRepeat: z.string(),
  commercialConsent: z.boolean(),
  privacyPolicyConsent: z.boolean(),
});

export const CreateUserSchemaRefined = CreateUserSchema.superRefine(
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

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateUserSettingsSchema = z.object({
  privacyPolicyConsent: z.boolean().optional(),
  commercialConsent: z.boolean().optional(),
});

export const emailResetSchema = z.object({ email: z.string().email() });
