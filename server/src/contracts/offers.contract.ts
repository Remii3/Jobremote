import { z } from "zod";
import {
  serverOfferFiltersSchema,
  OfferSchema,
  OfferSortOptionsSchema,
} from "../schemas/offerSchemas";
import { c } from "../utils/utils";

const createOfferSchema = OfferSchema.omit({ _id: true, createdAt: true })
  .strict()
  .extend({ userId: z.string() });

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
  updateOffer: {
    method: "PATCH",
    path: "/offer",
    body: OfferSchema.optional(),
    responses: {
      200: z.object({ msg: z.string() }),
      404: z.object({ msg: z.string() }),
      500: z.object({ msg: z.string() }),
    },
    summary: "Update an offer",
  },
  deleteOffer: {
    method: "DELETE",
    path: "/offer",
    body: z.object({
      offerId: z.string(),
    }),
    responses: {
      200: z.object({ msg: z.string() }),
      404: z.object({ msg: z.string() }),
      500: z.object({ msg: z.string() }),
    },
    summary: "Delete an offer",
  },
  getOffers: {
    method: "GET",
    path: `/offers`,
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      sortOption: OfferSortOptionsSchema,
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
  getUserOffers: {
    method: "GET",
    path: `/user/offers`,
    query: z.object({
      ids: z.array(z.string()).optional(),
    }),
    responses: {
      200: z.object({
        offers: z.array(OfferSchema),
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
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
