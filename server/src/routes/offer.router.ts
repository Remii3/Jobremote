import multer from "multer";
import bodyParser from "body-parser";
import { priceLogic } from "../middleware/priceLogic";
import {
  sanitizeCreateOffer,
  validateCreateOffer,
} from "../middleware/validators/validateCreateOffer";
import { Router } from "express";
import {
  createOffer,
  deleteOffer,
  extendActiveOffer,
  getOffers,
  getPaymentTypes,
  getSingleOffer,
  getTechnologies,
  offerApply,
  payForOffer,
  updateOffer,
  webhook,
} from "../controllers/offer.controller";
import { authenticateUser } from "../middleware/authenticateUser";
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/",
  [
    authenticateUser,
    upload.array("logo"),
    priceLogic,
    sanitizeCreateOffer,
    validateCreateOffer,
  ],
  createOffer
);
router.get("/", getOffers);
router.get("/:id", getSingleOffer);
router.patch("/:id", [upload.array("logo")], authenticateUser, updateOffer);
router.patch("/:id/mark-deleted", authenticateUser, deleteOffer);

// Application routes
router.post("/apply", [upload.array("cv")], offerApply);

// Static data routes
router.get("/metadata/payments", getPaymentTypes);
router.get("/metadata/technologies", getTechnologies);

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
