import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  privacyPolicyConsent: z.boolean(),
  commercialConsent: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const BaseUserFormSchema = UserSchema.pick({
  email: true,
  password: true,
  commercialConsent: true,
  privacyPolicyConsent: true,
}).extend({
  passwordRepeat: z.string().min(6),
});

export const UserFormSchema = BaseUserFormSchema.superRefine((data, ctx) => {
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
});
export const testSchema = BaseUserFormSchema.pick({
  email: true,
  password: true,
  passwordRepeat: true,
  privacyPolicyConsent: true,
  commercialConsent: true,
});
