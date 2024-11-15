import { z } from "zod";

export const CreateOfferSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    experience: z.string(),
    employmentType: z.string(),
    localization: z.string(),
    contractType: z.string(),
    minSalary: z.coerce
      .number()
      .gt(0, { message: "Min salary must be greater than 0" }),
    maxSalary: z.coerce
      .number()
      .gt(0, { message: "Max salary must be greater than 0" }),
    currency: z.string(),
    companyName: z.string(),
    redirectLink: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minSalary !== undefined && data.maxSalary !== undefined) {
        return data.minSalary < data.maxSalary;
      }
      return true;
    },
    {
      message: "Min salary must be lower than max salary",
      path: ["minSalary"],
    }
  );

export const UpdateOfferSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    experience: z.string().optional(),
    employmentType: z.string().optional(),
    companyName: z.string().optional(),
    contractType: z.string().optional(),
    localization: z.string().optional(),
    minSalary: z
      .number()
      .optional()
      .refine((data) => data === undefined || data > 0, {
        message: "Min salary must be greater than 0",
      }),
    maxSalary: z
      .number()
      .optional()
      .refine((data) => data === undefined || data > 0, {
        message: "Max salary must be greater than 0",
      }),
    currency: z.string().optional(),
    redirectLink: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minSalary !== undefined && data.maxSalary !== undefined) {
        return data.minSalary < data.maxSalary;
      }
      return true;
    },
    {
      message: "Min salary must be lower than max salary",
      path: ["minSalary"],
    }
  );

export const ClientModelFormSchema = z.object({
  pricing: z.string(),
});

export const ChangePasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordRepeat: z.string().min(8),
  })
  .refine(
    (data) => {
      if (data.password !== data.passwordRepeat) {
        return false;
      }
    },
    { message: "Passwords don't match", path: ["password"] }
  );
