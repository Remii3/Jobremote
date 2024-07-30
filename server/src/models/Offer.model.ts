import { Schema, model } from "mongoose";
import { z } from "zod";
import { allowedTechnologies, OfferSchema } from "../schemas/offerSchemas";

export type OfferType = z.infer<typeof OfferSchema>;

const offerSchema = new Schema<OfferType>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    enum: allowedTechnologies,
  },
});

export default model<OfferType>("Offer", offerSchema);
