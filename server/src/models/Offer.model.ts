import { Schema, model, Types } from "mongoose";
import { z } from "zod";
import { OfferSchema } from "../schemas/OfferSchema";

export type OfferType = z.infer<typeof OfferSchema>;

const offerSchema = new Schema<OfferType>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
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
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR"],
      required: true,
    },
    logo: {
      type: {
        key: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String, required: true },
      },
      default: null,
    },
    companyName: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activeUntil: {
      type: Date,
      default: null,
    },
    redirectLink: {
      type: String,
      default: null,
    },
    pricing: {
      type: String,
      required: true,
    },
    expireAt: { type: Date, default: null, index: { expires: "0s" } },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default model<OfferType>("Offer", offerSchema);
