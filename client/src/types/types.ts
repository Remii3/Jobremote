import { OfferSortOptionsSchema } from "@/schemas/offerSchemas";
import { z } from "zod";

export type AllowedCurrenciesType = "USD" | "EUR";

export type OfferType = {
  _id: string;
  title: string;
  content: string;
  contractType: string;
  experience: string;
  localization: string;
  employmentType: string;
  currency: AllowedCurrenciesType;
  minSalary: number;
  maxSalary: number;
  technologies: string[];
  logo?: string;
  companyName: string;
};

export type OfferFiltersType = {
  keyword: string;
  localization: string[];
  experience: string[];
  contractType: string[];
  employmentType: string[];
  technologies: string[];
  minSalary: number;
};

export type OfferFilterType = {
  _id: string;
  name: string;
};

// Filters

export type OfferSortOptionsTypes = z.infer<typeof OfferSortOptionsSchema>;
