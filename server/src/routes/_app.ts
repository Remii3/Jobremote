import { Router } from "express";
import { offerRouter } from "./offer.router";
import { userRouter } from "./user.router";
const router = Router();

router.use("/offers", offerRouter);
router.use("/users", userRouter);

export const mainRouter = router;
