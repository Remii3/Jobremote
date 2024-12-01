import multer from "multer";
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
} from "../controllers/offer.controller";
import { authenticateUser } from "../middleware/authenticateUser";
import {
  sanitizeUpdateOffer,
  validateUpdateOffer,
} from "../middleware/validators/validateUpdateOffer";
import {
  sanitizePayForOffer,
  validatePayForOffer,
} from "../middleware/validators/validatePayForOffer";
import {
  sanitizeOfferApply,
  validateOfferApply,
} from "../middleware/validators/validateOfferApply";
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
router.patch(
  "/:id",
  [
    authenticateUser,
    upload.array("logo"),
    sanitizeUpdateOffer,
    validateUpdateOffer,
  ],
  updateOffer
);
router.patch("/:id/mark-deleted", authenticateUser, deleteOffer);

// Application routes
router.post(
  "/apply",
  [upload.array("cv"), sanitizeOfferApply, validateOfferApply],
  offerApply
);

// Static data routes
router.get("/metadata/payments", getPaymentTypes);
router.get("/metadata/technologies", getTechnologies);

// Payment routes
router.post(
  "/:id/payment",
  [sanitizePayForOffer, validatePayForOffer, priceLogic],
  payForOffer
);
router.post(
  "/:id/extend",
  [sanitizePayForOffer, validatePayForOffer, priceLogic],
  extendActiveOffer
);

export { router as offerRouter };
