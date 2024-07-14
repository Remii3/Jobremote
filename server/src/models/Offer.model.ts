import { Schema, model, Document } from "mongoose";

interface OfferType {
  title: string;
  description: string;
}

const offerSchema = new Schema({
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
