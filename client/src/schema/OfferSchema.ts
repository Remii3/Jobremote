import { z } from "zod";

const currencies = ["USD", "EUR"] as const;

export const CreateOfferSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
    requirements: z.string().optional(),
    benefits: z.string().optional(),
    duties: z.string().optional(),
    experience: z.string().min(1, { message: "Experience is required" }),
    employmentType: z.string().min(1, { message: "Employment is required" }),
    localization: z.string().min(1, { message: "Localization is required" }),
    contractType: z.string().min(1, { message: "Contract type is required" }),
    minSalary: z.coerce
      .number()
      .gt(0, { message: "Min salary must be greater than 0" }),
    maxSalary: z.coerce
      .number()
      .gt(0, { message: "Max salary must be greater than 0" }),
    minSalaryYear: z.coerce.number().gt(0, {
      message: "Min salary year must be greater than 0",
    }),
    maxSalaryYear: z.coerce.number().gt(0, {
      message: "Max salary year must be greater than 0",
    }),
    currency: z.enum(currencies),
    companyName: z.string().min(1, { message: "Company name is required" }),
    redirectLink: z.string().optional(),
    technologies: z
      .array(z.string().min(1))
      .min(1, { message: "At least one technology is required" }),
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

export const applicationSchema = z
  .object({
    name: z.string().min(1, { message: "First and last name is required." }),
    email: z.string().min(1, { message: "Email is required." }).email(),
    description: z.string().optional(),
    cv: z
      .array(
        z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, {
          message: "File size must be less than 5MB",
        })
      )
      .max(1, { message: "Only one file is allowed." })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.cv === null || data.cv.length === 0) {
        return false;
      }
      return true;
    },
    {
      path: ["cv"],
      message: "CV is required.",
    }
  );
