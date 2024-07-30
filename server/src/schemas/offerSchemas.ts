import { z } from "zod";

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

export const ExperienceSchema = z.enum(experience);
export const TechnologySchema = z.enum(allowedTechnologies);
export const TypeOfWorkSchema = z.enum(typeOfWork);
export const LocalizationSchema = z.enum(localizations);

export const OfferSchema = z.object({
  _id: z.string(),
  title: z.string(),
  content: z.string(),
  categories: z.array(TechnologySchema).optional(),
  experience: ExperienceSchema,
  typeOfWork: TypeOfWorkSchema,
  localization: LocalizationSchema,
});

export const UserSchema = z.string();

export const offerFiltersSchema = z.object({
  categories: z.array(TechnologySchema).optional(),
  keyword: z.string().optional(),
  experience: z.array(ExperienceSchema).optional(),
  typeOfWork: z.array(TypeOfWorkSchema).optional(),
  localization: z.array(LocalizationSchema).optional(),
  minSalary: z.string().optional(),
  maxSalary: z.string().optional(),
});

export const JobPositionSchema = z.object({
  title: z.string(),
  createdAt: z.string().optional(),
});
