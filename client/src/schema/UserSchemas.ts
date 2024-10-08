import { CreateUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { z } from "zod";

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
