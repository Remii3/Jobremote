import { z } from "zod";

export const newOfferSchema = z
  .object({
    title: z
      .string({ message: "Title field is required." })
      .min(1, "Title is required"),
    description: z.string().optional(),
  })
  .strict();

export const getOffersSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
