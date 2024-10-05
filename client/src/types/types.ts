import { OfferSortOptionsSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { z } from "zod";

export type AllowedCurrenciesType = "USD" | "EUR";

export type OfferType = {
  _id: string;
  title: string;
  content: string;
  experience: string;
  localization: string;
  contractType: string;
  employmentType: string;
  maxSalary: number;
  minSalary: number;
  currency: AllowedCurrenciesType;
  technologies: string[];
  logo: { key: string; url: string; name: string } | null;
  companyName: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminOfferType = OfferType & {
  pricing: "basic" | "standard" | "premium";
  isPaid: boolean;
  activeUntil: string | null;
  userId: string;
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

export type UserType = {
  _id: string;
  email: string;
  commercialConsent: boolean;
  createdAt: string;
  updatedAt: string;
  appliedToOffers: string[];
  name: string;
  description: string;
};
