import { Router } from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  getUser,
  getUserOffer,
  getUserOffers,
  loginUser,
  logoutUser,
  refreshToken,
  resetPassword,
  updateUser,
  updateUserSettings,
} from "../controllers/user.controller";
import { authenticateUser } from "../middleware/authenticateUser";
import rateLimit from "express-rate-limit";

const router = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

// User management routes
router.post("/", createUser);
router.get("/me", authenticateUser, getUser);
router.patch("/:id/profile", updateUser);
router.patch("/:id/settings", updateUserSettings);
router.patch("/:id/mark-deleted", deleteUser);

// User offers routes
router.get("/offers", getUserOffers);
router.get("/offers/:offerId", getUserOffer);

// Authentication and session routes
router.post("/login", loginRateLimit, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

// Password management routes
router.post("/reset-password", resetPassword);
router.post("/update-password", changePassword);

export { router as userRouter };
