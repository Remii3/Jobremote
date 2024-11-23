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
import {
  sanitizeCreateUser,
  validateCreateUser,
} from "../middleware/validators/validateCreateUser";
import {
  sanitizeLoginUser,
  validateLoginUser,
} from "../middleware/validators/validateLoginUser";
import {
  sanitizePasswordChange,
  validatePasswordChange,
} from "../middleware/validators/validatePasswordChange";

const router = Router();

const createUserRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many register attempts. Please try again later.",
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

const passwordChangeRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many password change attempts. Please try again later.",
});

// User management routes
router.post(
  "/",
  [createUserRateLimit, sanitizeCreateUser, validateCreateUser],
  createUser
);
router.get("/me", authenticateUser, getUser);
router.patch("/:id/profile", authenticateUser, updateUser);
router.patch("/:id/settings", authenticateUser, updateUserSettings);
router.patch("/:id/mark-deleted", authenticateUser, deleteUser);

// User offers routes
router.get("/offers", getUserOffers);
router.get("/offers/:offerId", getUserOffer);

// Authentication and session routes
router.post(
  "/login",
  [loginRateLimit, sanitizeLoginUser, validateLoginUser],
  loginUser
);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

// Password management routes
router.post("/reset-password", resetPassword);
router.post(
  "/update-password",
  [passwordChangeRateLimit, sanitizePasswordChange, validatePasswordChange],
  changePassword
);

export { router as userRouter };
