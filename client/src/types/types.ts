import { ClientInferResponseBody } from "@ts-rest/core";
import { mainContract } from "../../../server/src/contracts/_app";
import {
  clientOfferFiltersSchema,
  CurrencySchema,
  OfferSortOptionsSchema,
  serverOfferFiltersSchema,
} from "../../../server/src/schemas/offerSchemas";
import { z } from "zod";

export type OfferType = ClientInferResponseBody<
  typeof mainContract.offers.getOffer,
  200
>["offer"];

export type OfferFiltersType = z.infer<typeof clientOfferFiltersSchema>;
export type OfferCategoriesType = OfferFiltersType["categories"];

// Filters

export type CurrencyTypes = z.infer<typeof CurrencySchema>;
export type OfferSortOptionsTypes = z.infer<typeof OfferSortOptionsSchema>;
