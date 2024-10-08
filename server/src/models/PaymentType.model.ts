import { model, Schema } from "mongoose";
import { z } from "zod";
import { PaymentTypeOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";

export type PaymentTypeSchemaType = z.infer<typeof PaymentTypeOfferSchema>;

const PaymentTypeSchema = new Schema<PaymentTypeSchemaType>({
  name: String,
  code: String,
  price: Number,
  benefits: [String],activeMonths: Number,
});

export const PaymentModel = model<PaymentTypeSchemaType>(
  "PaymentType",
  PaymentTypeSchema
);
