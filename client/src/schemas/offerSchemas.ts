import { allowedCurrencies } from "@/data/constant";
import { AllowedCurrenciesType } from "@/types/types";
import { z } from "zod";

export const offerSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  experience: z.string().min(1),
  localization: z.string().min(1),
  employmentType: z.string().min(1),
  contractType: z.string().min(1),
  minSalary: z.number(),
  maxSalary: z.number(),
  currency: z.enum(
    allowedCurrencies as [AllowedCurrenciesType, ...AllowedCurrenciesType[]]
  ),
  technologies: z.array(z.string()),
  logo: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(1, { message: "Only one file is allowed." })
    .nullable(),
});
