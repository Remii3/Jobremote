import { model, Schema } from "mongoose";
import { z } from "zod";
import { ContractTypeOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";

type ContractType = z.infer<typeof ContractTypeOfferSchema>;

const ContractTypeSchema = new Schema<ContractType>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ContractType>("ContractType", ContractTypeSchema);
