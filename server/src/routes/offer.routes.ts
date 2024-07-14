import { Router } from "express";
import { createOffer, getOffers } from "../controllers/Offer.controller";

const router = Router();

router.get("/offer", getOffers);

router.post("/offer", createOffer);

export { router as offerRouter };
