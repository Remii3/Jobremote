import { z } from "zod";
import { serverOfferFiltersSchema, OfferSchema } from "../schemas/offerSchemas";
import { c } from "../utils/utils";

const createOfferSchema = OfferSchema.omit({ _id: true }).strict();

export const offersContract = c.router({
  createOffer: {
    method: "POST",
    path: "/offer",
    responses: {
      201: z.object({ msg: z.string(), offer: createOfferSchema }),
    },
    body: createOfferSchema,
    summary: "Create a new offer",
  },
  getOffers: {
    method: "GET",
    path: `/offers`,
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      filters: serverOfferFiltersSchema.optional(),
    }),
    responses: {
      200: z.object({
        offers: z.array(OfferSchema),
        msg: z.string(),
        fromCache: z.boolean().optional(),
        pagination: z.object({
          total: z.number(),
          page: z.number(),
          pages: z.number(),
        }),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    summary: "Get offers",
  },
  getOffer: {
    method: "GET",
    path: `/offer/:id`,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({
        offer: OfferSchema,
        msg: z.string(),
      }),
      404: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
  },
});
