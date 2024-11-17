import { Types } from "mongoose";
import { z } from "zod";

export const OfferSchema = z.object({
  _id: z.instanceof(Types.ObjectId),
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  localization: z.string().min(1, { message: "Localization is required" }),
  contractType: z.string().min(1, { message: "Contract type is required" }),
  employmentType: z.string().min(1, { message: "Employment type is required" }),
  maxSalary: z.coerce
    .number()
    .gt(0, { message: "Max salary must be greater than 0" }),
  minSalary: z.coerce
    .number()
    .gt(0, { message: "Min salary must be greater than 0" }),
  technologies: z.array(z.string()),
  currency: z.enum(["USD", "EUR"]),
  logo: z
    .object({
      key: z.string(),
      url: z.string().url(),
      name: z.string(),
    })
    .nullable(),
  companyName: z.string().min(1, { message: "Company name is required" }),
  isPaid: z.boolean().default(false),
  pricing: z.string(),
  expireAt: z.date().nullable(),
  isDeleted: z.boolean().default(false),
  deletedAt: z.date().nullable(),
  activeUntil: z.string().nullable(),
  userId: z.instanceof(Types.ObjectId),
  redirectLink: z.string(),
  priceType: z.enum(["monthly", "yearly"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PaymentTypeOfferSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  price: z.number().gt(0, { message: "Price must be greater than 0" }),
  benefits: z.array(z.string()),
  activeMonths: z
    .number()
    .gt(0, { message: "Active months must be greater than 0" }),
});

export const TechnologyOfferSchema = z.object({
  _id: z.string(),
  name: z.string(),
  code: z.string(),
  createdAt: z.coerce.date(),
});
