import { z } from "zod";
export const allowedCurrencies = ["USD", "EUR"] as const;
export const allowedTechnologies = [
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "Ruby on Rails",
  "Java",
  "Spring",
  // Add more technologies as needed
] as const;

export const experience = [
  "Senior",
  "Mid",
  "Junior",
  // add more experience as needed
] as const;

export const typeOfWork = [
  "Full-time",
  "Part-time",
  "Internship",
  "Freelance",
  // add more as needed
] as const;

export const localizations = [
  "Europe",
  "Africa",
  "North America",
  "South America",
  "Worldwide",
] as const;

export const EmploymentTypeSchema = z.enum(["B2B", "UoP"], {
  message: "Employment type is required.",
});

export const ExperienceSchema = z.enum(experience, {
  message: "Experience is required.",
});
export const TechnologySchema = z.enum(allowedTechnologies, {
  message: "Technology is required.",
});
export const TypeOfWorkSchema = z.enum(typeOfWork, {
  message: "Type of work is required.",
});
export const LocalizationSchema = z.enum(localizations, {
  message: "Localization is required.",
});

export const CurrencySchema = z.enum(allowedCurrencies, {
  message: "Currency is required.",
});

export const OfferSchema = z.object({
  _id: z.string(),
  title: z.string().min(2),
  content: z.string().min(2),
  categories: z.array(TechnologySchema).optional(),
  experience: ExperienceSchema,
  typeOfWork: TypeOfWorkSchema,
  localization: LocalizationSchema,
  employmentType: EmploymentTypeSchema,
  currency: CurrencySchema,
  minSalary: z.coerce.number().gt(0),
  maxSalary: z.coerce.number().gt(0),
  technologies: z.array(TechnologySchema).optional(),
  createdAt: z.string(),
});

export const serverOfferFiltersSchema = z.object({
  categories: z.array(TechnologySchema).optional(),
  keyword: z.string().optional(),
  experience: z.array(ExperienceSchema).optional(),
  typeOfWork: z.array(TypeOfWorkSchema).optional(),
  localization: z.array(LocalizationSchema).optional(),
  minSalary: z.string().optional(),
  technologies: z.array(TechnologySchema).optional(),
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
