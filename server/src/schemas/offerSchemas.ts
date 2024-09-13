import { z } from "zod";
export const allowedCurrencies = ["USD", "EUR"] as const;

export const CurrencySchema = z.enum(allowedCurrencies, {
  message: "Currency is required.",
});

export const OfferSchema = z.object({
  _id: z.any(),
  title: z.string().min(2),
  content: z.string().min(2),
  experience: z.string(),
  localization: z.string(),
  contractType: z.string(),
  employmentType: z.string(),
  currency: CurrencySchema,
  minSalary: z.coerce.number().gt(0),
  maxSalary: z.coerce.number().gt(0),
  technologies: z.array(z.string()),
  createdAt: z.string(),
  isDeleted: z.boolean(),
  deletedAt: z.date().nullish(),
  logo: z.any(),
  companyName: z.string(),
  isPaid: z.boolean(),
});

export const ClientOfferSchema = OfferSchema.omit({
  _id: true,
  isDeleted: true,
  deletedAt: true,
}).extend({
  _id: z.string(),
});

export const serverOfferFiltersSchema = z.object({
  keyword: z.string().optional(),
  experience: z.array(z.string()).optional(),
  contractType: z.array(z.string()).optional(),
  employmentType: z.array(z.string()).optional(),
  localization: z.array(z.string()).optional(),
  minSalary: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

export const JobPositionSchema = z.object({
  title: z.string(),
  createdAt: z.string().optional(),
});

export const OfferSortOptionsSchema = z.enum([
  "salary_highest",
  "salary_lowest",
  "latest",
]);

export const TechnologyOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});

export const LocalizationOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});

export const EmploymentTypeOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});

export const ExperienceOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});

export const ContractTypeOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});
export const createOfferSchema = OfferSchema.omit({
  _id: true,
  createdAt: true,
  deletedAt: true,
  isDeleted: true,
  technologies: true,
  isPaid: true,
})
  .strict()
  .extend({
    userId: z.string(),
    technologies: z.string(),
  });
