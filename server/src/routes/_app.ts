import { Router } from "express";
import { offerRouter } from "./offer.router";
import { userRouter } from "./user.router";
import bodyParser from "body-parser";
import { webhook } from "../controllers/offer.controller";
const router = Router();

router.use("/offers", offerRouter);
router.use("/users", userRouter);
// Webhook routes
router.post(
  "/webhook",
  [bodyParser.raw({ type: "application/json" })],
  webhook
);
export const mainRouter = router;
