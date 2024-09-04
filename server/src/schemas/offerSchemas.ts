import mongoose from "mongoose";
import { z } from "zod";
export const allowedCurrencies = ["USD", "EUR"] as const;

export const CurrencySchema = z.enum(allowedCurrencies, {
  message: "Currency is required.",
});

export const OfferSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  title: z.string().min(2),
  content: z.string().min(2),
  experience: z.string(),
  localization: z.string(),
  employmentType: z.array(z.string()),
  currency: CurrencySchema,
  minSalary: z.coerce.number().gt(0),
  maxSalary: z.coerce.number().gt(0),
  technologies: z.array(z.string()).optional(),
  createdAt: z.string(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.date().optional(),
  logo: z.any(),
});

export const serverOfferFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  keyword: z.string().optional(),
  experience: z.array(z.string()).optional(),
  typeOfWork: z.array(z.string()).optional(),
  localization: z.array(z.string()).optional(),
  minSalary: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

export const clientOfferFiltersSchema = serverOfferFiltersSchema.extend({
  minSalary: z.number().optional(),
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
