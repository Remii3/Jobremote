import { model, Schema } from "mongoose";
import { z } from "zod";
import { ExperienceOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";

type ExperienceType = z.infer<typeof ExperienceOfferSchema>;

const ExperienceSchema = new Schema<ExperienceType>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ExperienceType>("Experience", ExperienceSchema);
