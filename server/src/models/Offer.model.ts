import { Schema, model, Types } from "mongoose";

export interface OfferType {
  _id: Types.ObjectId;
  title: string;
  description: string;
}

const offerSchema = new Schema<OfferType>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default model<OfferType>("Offer", offerSchema);
