import { Router } from "express";
import {
  changePassword,
  checkUserSession,
  createUser,
  deleteUser,
  getUser,
  getUserOffer,
  getUserOffers,
  loginUser,
  logoutUser,
  resetPassword,
  updateUser,
  updateUserSettings,
} from "../controllers/user.controller";

const router = Router();

// User management routes
router.post("/", createUser);
router.get("/me", getUser);
router.patch("/:id/profile", updateUser);
router.patch("/:id/settings", updateUserSettings);
router.patch("/:id/mark-deleted", deleteUser);

// User offers routes
router.get("/offers", getUserOffers);
router.get("/offers/:offerId", getUserOffer);

// Authentication and session routes
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-session", checkUserSession);

// Password management routes
router.post("/reset-password", resetPassword);
router.post("/update-password", changePassword);

export { router as userRouter };
