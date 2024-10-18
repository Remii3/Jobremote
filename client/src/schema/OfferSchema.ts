import { CreateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { z } from "zod";

export const ClientOfferFormSchema = CreateOfferSchema.omit({
  userId: true,
  logo: true,
  pricing: true,
  technologies: true,
})
  .refine((data) => data.minSalary < data.maxSalary, {
    message: "Min salary must be lower than max salary",
    path: ["minSalary"],
  });

export const ClientModelFormSchema = CreateOfferSchema.pick({
  pricing: true,
});
