import { model, Schema } from "mongoose";
import { z } from "zod";
import { LocalizationOfferSchema } from "../schemas/offerSchemas";

type LocalizationOfferType = z.infer<typeof LocalizationOfferSchema>;

const LocalizationSchema = new Schema<LocalizationOfferType>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<LocalizationOfferType>("Localization", LocalizationSchema);
