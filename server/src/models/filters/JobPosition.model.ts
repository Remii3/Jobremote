import { model, Schema } from "mongoose";
import { z } from "zod";
import { JobPositionSchema } from "../../schemas/offerSchemas";

export type JobPositionType = z.infer<typeof JobPositionSchema>;

const jobPositionSchema = new Schema<JobPositionType>({
  title: {
    unique: true,
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
});

export default model<JobPositionType>("JobPosition", jobPositionSchema);
