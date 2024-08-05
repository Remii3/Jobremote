import { model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

const userConsentSchema = new Schema({
  userId: { type: ObjectId, required: true },
  consentType: {
    type: String,
    required: true,
    enum: ["privacyPolicy", "emailMarketing"],
  },
  consentStatus: { type: Boolean, required: true },
  consentTimestamp: { type: String, default: () => new Date().toISOString() },
});

export const UserConset = model("UserConsent", userConsentSchema);
