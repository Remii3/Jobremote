import multer from "multer";
import bodyParser from "body-parser";
import { priceLogic } from "../middleware/priceLogic";
import { sanitizeOfferContent } from "../middleware/sanitizer";
import { Router } from "express";
import {
  createOffer,
  deleteOffer,
  extendActiveOffer,
  getContractTypes,
  getEmploymentTypes,
  getExperiences,
  getOffers,
  getPaymentTypes,
  getTechnologies,
  offerApply,
  payForOffer,
  updateOffer,
  webhook,
} from "../controllers/offer.controller";
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  [upload.array("logo"), priceLogic, sanitizeOfferContent],
  createOffer
);
router.get("/", getOffers);
router.patch("/:id", [upload.array("logo")], updateOffer);
router.patch("/:id/mark-deleted", deleteOffer);

// Application routes
router.post("/apply", [upload.array("cv")], offerApply);

// Static data routes
router.get("/metadata/payments", getPaymentTypes);
router.get("/metadata/technologies", getTechnologies);
router.get("/metadata/employments", getEmploymentTypes);
router.get("/metadata/experiences", getExperiences);
router.get("/metadata/contracts", getContractTypes);

// Payment routes
router.post("/:id/payment", [priceLogic], payForOffer);
router.post("/:id/extend", [priceLogic], extendActiveOffer);

// Webhook routes
router.post(
  "/webhook",
  [bodyParser.raw({ type: "application/json" })],
  webhook
);

export { router as offerRouter };
