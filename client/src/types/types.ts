import { ClientInferResponseBody } from "@ts-rest/core";
import { mainContract } from "../../../server/src/contracts/_app";
import { offerFiltersSchema } from "../../../server/src/schemas/offerSchemas";
import { z } from "zod";

export type OfferType = ClientInferResponseBody<
  typeof mainContract.offers.getOffer,
  200
>["offer"];

export type OfferFiltersType = z.infer<typeof offerFiltersSchema>;
export type OfferCategoriesType = OfferFiltersType["categories"];

// Filters

export type FilterSwitch = {
  operation: "multi-choice" | "single-choice";
  newFilterKey: keyof OfferFiltersType;
  newFilterValue: any;
};
