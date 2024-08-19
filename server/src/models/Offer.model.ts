import { Schema, model } from "mongoose";
import { z } from "zod";
import {
  allowedCurrencies,
  allowedTechnologies,
  experience,
  localizations,
  OfferSchema,
  typeOfWork,
} from "../schemas/offerSchemas";

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
  experience: {
    type: String,
    enum: experience,
  },
  localization: {
    type: String,
    enum: localizations,
  },
  typeOfWork: {
    type: String,
    enum: typeOfWork,
  },
  employmentType: {
    type: String,
    required: true,
  },
  maxSalary: {
    type: Number,
    required: true,
  },
  minSalary: {
    type: Number,
    required: true,
  },
  technologies: {
    type: [String],
    enum: allowedTechnologies,
  },
  currency: {
    type: String,
    enum: allowedCurrencies,
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

export default model<OfferType>("Offer", offerSchema);
