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
  minSalary: z.coerce.number(),
  maxSalary: z.coerce.number(),
  pricing: z.enum(["basic", "standard", "premium"]),
  currency: z.enum(
    allowedCurrencies as [AllowedCurrenciesType, ...AllowedCurrenciesType[]]
  ),
  technologies: z.array(z.string()),
  logo: z.array(z.instanceof(File)).nullable(),
  companyName: z.string().min(1),
});

export const OfferSortOptionsSchema = z.enum([
  "latest",
  "salary_highest",
  "salary_lowest",
]);
