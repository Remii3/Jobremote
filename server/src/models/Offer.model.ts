import { Schema, model } from "mongoose";
import { z } from "zod";
import { allowedCurrencies, OfferSchema } from "../schemas/offerSchemas";

export type OfferType = z.infer<typeof OfferSchema>;

const offerSchema = new Schema<OfferType>({
  _id: { type: Schema.ObjectId, required: true },
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
    required: true,
  },
  localization: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  contractType: {
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
  },
  currency: {
    type: String,
    enum: allowedCurrencies,
  },
  logo: {
    type: { key: String, url: String, name: String },
  },
  companyName: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  pricing: {
    type: String,
    enum: ["basic", "standard", "premium"],
    required: true,
  },
  createdAt: { type: String, default: () => new Date().toISOString() },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
});

export default model<OfferType>("Offer", offerSchema);
