import { User } from "../models/User.model";
import { genPassword } from "../utils/utils";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import OfferModel from "../models/Offer.model";
import { Request, Response } from "express";
import { CreateUser } from "../types/controllers";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import jwt, { JwtPayload } from "jsonwebtoken";

export const createUser = async (
  req: Request<{}, {}, CreateUser>,
  res: Response
) => {
  const { email, password, commercialConsent, privacyPolicyConsent } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        msg: "User already exists.",
        field: "email",
      });
    }

    const passwordHash = await genPassword(password);
    const userId = new mongoose.Types.ObjectId();

    await User.create({
      _id: userId,
      email,
      password: passwordHash,
      commercialConsent,
      privacyPolicyConsent,
    });

    return res.status(201).json({
      msg: "User created successfully",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({
      msg: "We failed to create your new account. Please try again later.",
    });
  }
};

export const getUserOffers = async (req: Request, res: Response) => {
  const { _id } = req.query;
  try {
    const offers = await User.findOne({ _id })
      .select("_id")
      .populate({ path: "createdOffers", match: { isDeleted: false } })
      .lean();

    if (!offers) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (offers.createdOffers.length === 0) {
      return res.status(200).json({ offers: [], msg: "No offers found" });
    }

    const preparedOffers = offers.createdOffers.map((offer) => ({
      ...offer,
      _id: offer._id.toString(),
    }));

    return res.status(200).json({
      offers: preparedOffers,
      msg: "Offers fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "We failed to fetch your offers. Please try again later.",
    });
  }
};

export const getUserOffer = async (req: Request, res: Response) => {
  const { _id } = req.query;
  try {
    const offer = await OfferModel.findById(_id).lean();
    if (!offer) {
      return res.status(404).json({ msg: "Offer not found" });
    }

    if (offer.isDeleted) {
      return res.status(404).json({ msg: "Offer is deleted" });
    }

    const preparedOffer = {
      ...offer,
      _id: offer._id.toString(),
      userId: offer.userId.toString(),
    };

    return res.status(200).json({
      offer: preparedOffer,
      msg: "Offer fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "We failed to get you the selected offer.",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const { ...updatedFieldsValues } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id },
      { $set: { ...updatedFieldsValues } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    return res.status(200).json({ msg: "User updated." });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      msg: "We failed to update your account. Please try again later.",
    });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  const { id: _id } = req.params;
  const { ...updatedSettings } = req.body;
  try {
    const updateStatus = await User.findByIdAndUpdate(
      _id,
      { $set: { ...updatedSettings } },
      { new: true, runValidators: true }
    );
    if (!updateStatus) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "Settings updated" });
  } catch (err) {
    console.error("Error updating user settings:", err);
    return res.status(500).json({
      msg: "We failed to update your settings.",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const maxAttempts = 5;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        field: "email",
        msg: "User not found.",
      });
    }

    if (user.isBanned()) {
      return res.status(403).json({
        field: "email",
        msg: "Account is banned. Please reset your password to unlock it.",
      });
    }

    if (user.isLocked()) {
      return res.status(403).json({
        field: "email",
        msg: "Account is locked. Please try again later.",
      });
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      const updatedUser: any = await user.incLoginAttempts();
      const attemptsLeft = maxAttempts - updatedUser.loginAttempts;
      const invalidPasswordMsg = `Invalid password. You have ${attemptsLeft} attempt(s) left.`;
      if (
        updatedUser.isLocked() ||
        updatedUser.loginAttempts >= maxAttempts - 2
      ) {
        return res.status(401).json({
          field: "password",
          msg: invalidPasswordMsg,
        });
      }
      return res.status(401).json({
        field: "password",
        msg: "Invalid password.",
      });
    }

    user.resetLoginAttempts();

    const accessToken = generateAccessToken({ userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ userId: user._id.toString() });

    req.session.refreshToken = refreshToken;

    return res.status(200).json({
      msg: "User logged in.",
      accessToken,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({
      msg: "We failed to log you in. Please try again later.",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId, {
      _id: 1,
      email: 1,
      commercialConsent: 1,
      updatedAt: 1,
      createdAt: 1,
      name: 1,
      description: 1,
      appliedToOffers: 1,
    }).lean();

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    const preparedUser = {
      ...user,
      _id: user._id.toString(),
    };

    return res.status(200).json({
      user: preparedUser,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(500).json({
      msg: "We failed to retrieve your user data. Please try again later.",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Failed to logout" });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      msg: "Logged out successfully.",
    });
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ msg: "No refresh token found" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err, payload) => {
        if (err) {
          return res.status(403).json({ msg: "Invalid refresh token" });
        }

        const accessToken = generateAccessToken({
          userId: (payload as JwtPayload).userId!.toString(),
        });
        const newRefreshToken = generateRefreshToken({
          userId: (payload as JwtPayload).userId!.toString(),
        });

        req.session.refreshToken = newRefreshToken;

        return res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to generate new token." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const resetPasswordToken = crypto.randomUUID();
    const resetPasswordExpires = Date.now() + 3600000;

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetPasswordToken,
          resetPasswordExpires,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        field: "email",
        msg: "User not found",
      });
    }

    const transporter = createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested to reset your password for your account.\n\n
             Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n
             ${process.env.CORS_URI}/change-password/${resetPasswordToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      msg: "Password reset mail sent.",
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({
      msg: "We failed to reset your password. Please try again later.",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, resetToken } = req.body;

  if (!resetToken) {
    return res.status(400).json({
      msg: "Reset token is invalid or has expired.",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        msg: "Reset token is invalid or has expired.",
      });
    }
    user.setPassword(password);

    return res.status(200).json({
      msg: "Password changed successfully.",
    });
  } catch (err) {
    console.error("Error changing password:", err);

    return res.status(500).json({
      msg: "We failed to change your password. Please try again later.",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.body;
  try {
    const deletedUser = await User.findByIdAndUpdate(
      { _id },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      msg: "We failed to delete your account. Please try again later.",
    });
  }
};
