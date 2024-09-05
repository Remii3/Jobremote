import { ClientInferResponseBody } from "@ts-rest/core";
import { mainContract } from "../../../server/src/contracts/_app";
import {
  CurrencySchema,
  OfferSortOptionsSchema,
} from "../../../server/src/schemas/offerSchemas";
import { z } from "zod";
type allowedCurrenciesType = "USD" | "EUR";

export type OfferType = {
  _id: string;
  title: string;
  content: string;
  contractType: string; //ContractTypeSchema
  experience: string; //ExperienceSchema
  localization: string; //LocalizationSchema
  employmentType: string; // EmploymentTypeSchema
  currency: allowedCurrenciesType; //CurrencySchema
  minSalary: number;
  maxSalary: number;
  technologies: string[]; //TechnologySchema
  logo?: any;
};

export type OfferFiltersType = {
  keyword: string;
  experience: string[];
  typeOfWork: string[];
  localization: string[];
  minSalary: number;
  technologies: string[];
};

export type GetOfferType = ClientInferResponseBody<
  typeof mainContract.offers.getOffer,
  200
>["offer"];

export type NewOfferType = ClientInferResponseBody<
  typeof mainContract.offers.createOffer,
  201
>["offer"];

// Filters

export type CurrencyTypes = z.infer<typeof CurrencySchema>;
export type OfferSortOptionsTypes = z.infer<typeof OfferSortOptionsSchema>;
