import { model, Schema } from "mongoose";
import { z } from "zod";
import { ContractTypeOfferSchema } from "../schemas/offerSchemas";

type ContractType = z.infer<typeof ContractTypeOfferSchema>;

const ContractSchema = new Schema<ContractType>({});

export default model<ContractType>("ContractType", ContractSchema);
