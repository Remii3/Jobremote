import { ClientInferResponseBody } from "@ts-rest/core";
import { mainContract } from "../../../server/src/contracts/_app";
import { OfferSortOptionsSchema } from "../../../server/src/schemas/offerSchemas";
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

export type GetOfferType = ClientInferResponseBody<
  typeof mainContract.offers.getOffer,
  200
>["offer"];

export type NewOfferType = ClientInferResponseBody<
  typeof mainContract.offers.createOffer,
  201
>["offer"];

// Filters

export type OfferSortOptionsTypes = z.infer<typeof OfferSortOptionsSchema>;
