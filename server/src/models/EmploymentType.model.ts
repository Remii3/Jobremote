import { model, Schema } from "mongoose";
import { EmploymentTypeOfferSchema } from "../schemas/offerSchemas";
import { z } from "zod";

type EmploymentType = z.infer<typeof EmploymentTypeOfferSchema>;

const EmploymentTypeSchema = new Schema<EmploymentType>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<EmploymentType>("EmploymentType", EmploymentTypeSchema);
