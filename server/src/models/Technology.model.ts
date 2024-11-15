import { model, Schema } from "mongoose";
import { TechnologyOfferSchema } from "../schemas/OfferSchema";
import z from "zod";

export type TechnologySchemaType = z.infer<typeof TechnologyOfferSchema>;

const TechnologySchema = new Schema<TechnologySchemaType>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<TechnologySchemaType>("Technology", TechnologySchema);
