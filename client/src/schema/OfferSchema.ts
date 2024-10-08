import { CreateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { z } from "zod";

export const ClientOfferFormSchema = CreateOfferSchema.omit({
  userId: true,
  logo: true,
  pricing: true,
  technologies: true,
}).extend({
  technologies: z.array(z.string()),
});

export const ClientModelFormSchema = CreateOfferSchema.pick({
  pricing: true,
});
