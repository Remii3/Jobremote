import { userContract } from "jobremotecontracts";
import { User } from "../models/User.model";
import { genPassword, getDataFromToken, tsServer } from "../utils/utils";
import { sign } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import mongoose from "mongoose";
import OfferModel from "../models/Offer.model";

export const usersRouter = tsServer.router(userContract, {
  createUser: async ({ body }) => {
    const {
      email,
      password,
      passwordRepeat,
      commercialConsent,
      privacyPolicyConsent,
    } = body;

    if (password !== passwordRepeat) {
      return {
        status: 400,
        body: {
          msg: "Passwords do not match",
          field: "passwordRepeat",
        },
      };
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          status: 409,
          body: {
            msg: "User already exists",
            field: "email",
          },
        };
      }

      const passwordHash = await genPassword(password);
      const userId = new mongoose.Types.ObjectId();

      const newUser = await User.create({
        _id: userId,
        email,
        password: passwordHash,
        commercialConsent,
        privacyPolicyConsent,
      });

      return {
        status: 201,
        body: {
          msg: "User created successfully",
          user: {
            email: newUser.email,
            commercialConsent: newUser.commercialConsent,
            privacyPolicyConsent: newUser.privacyPolicyConsent,
            createdAt: newUser.createdAt,
          },
        },
      };
    } catch (err) {
      console.error("Error creating user:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to create your new account. Please try again later.",
        },
      };
    }
  },
  getUserOffers: async ({ query }) => {
    const { _id } = query;
    const offers = await User.findOne({ _id })
      .select("_id")
      .populate({ path: "createdOffers", match: { isDeleted: false } })
      .lean();
    if (!offers) {
      return {
        status: 200,
        body: {
          offers: [],
          msg: "No offers found",
        },
      };
    }

    const preparedOffers = offers.createdOffers.map((offer) => ({
      ...offer,
      _id: offer._id.toString(),
    }));

    return {
      status: 200,
      body: {
        offers: preparedOffers,
        msg: "Offers fetched successfully",
      },
    };
  },
  getUserOffer: async ({ query }) => {
    const { _id } = query;
    try {
      const offer = await OfferModel.findById(_id).lean();
      if (!offer) {
        return {
          status: 404,
          body: {
            msg: "Offer not found",
          },
        };
      }
      const preparedOffer = {
        ...offer,
        _id: offer._id.toString(),
        userId: offer.userId.toString(),
      };
      return {
        status: 200,
        body: {
          offer: preparedOffer,
          msg: "Offer fetched successfully",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to get you the selected offer.",
        },
      };
    }
  },
  updateUser: async ({ body }) => {
    const { _id, ...updatedFieldsValues } = body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id },
        { $set: { ...updatedFieldsValues } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return {
          status: 404,
          body: {
            msg: "User not found",
          },
        };
      }

      return {
        status: 200,
        body: {
          msg: "User updated",
        },
      };
    } catch (err) {
      console.error("Error updating user:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to update your account. Please try again later.",
        },
      };
    }
  },
  updateUserSettings: async ({ body }) => {
    const { _id, ...updatedSettings } = body;
    try {
      const updateStatus = await User.findByIdAndUpdate(
        _id,
        { $set: { ...updatedSettings } },
        { new: true, runValidators: true }
      );
      if (!updateStatus) {
        return {
          status: 404,
          body: {
            msg: "User not found",
          },
        };
      }
      return {
        status: 200,
        body: {
          msg: "Settings updated",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to update your settings.",
        },
      };
    }
  },
  loginUser: async ({ body, res }) => {
    const { email, password } = body;
    const maxAttempts = 5;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          status: 404,
          body: {
            field: "email",
            msg: "User not found.",
          },
        };
      }
      if (user.isBanned()) {
        return {
          status: 403,
          body: {
            field: "email",
            msg: "Account is banned. Please reset your password to unlock it.",
          },
        };
      }
      if (user.isLocked()) {
        return {
          status: 403,
          body: {
            field: "email",
            msg: "Account is locked. Please try again later.",
          },
        };
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
          return {
            status: 401,
            body: {
              field: "password",
              msg: invalidPasswordMsg,
            },
          };
        }
        return {
          status: 401,
          body: {
            field: "password",
            msg: "Invalid password.",
          },
        };
      }

      user.resetLoginAttempts();

      const tokenData = {
        _id: user._id,
      };
      const token = sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400000),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      return {
        status: 200,
        body: {
          msg: "User logged in",
          data: {
            email: user.email,
          },
        },
      };
    } catch (err) {
      console.error("Error during login:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to log you in.",
        },
      };
    }
  },
  getUser: async ({ req, res }) => {
    try {
      const userId = await getDataFromToken(req, res);
      if (!userId) {
        return {
          status: 401,
          body: {
            msg: "User not authenticated.",
          },
        };
      }
      const user = await User.findById(userId, {
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
        return {
          status: 404,
          body: {
            msg: "User not found",
          },
        };
      }

      const preparedUser = {
        ...user,
        _id: user._id.toString(),
      };

      return {
        status: 200,
        body: {
          user: preparedUser,
        },
      };
    } catch (err) {
      console.error("Error fetching user data:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to retrieve your user data. Please try again later.",
        },
      };
    }
  },
  logoutUser: async ({ res }) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        expires: new Date(0),
      });
      return {
        status: 200,
        body: {
          msg: "User logged out",
        },
      };
    } catch (err) {
      console.error("Error during logout:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to log you out. Please try again later.",
        },
      };
    }
  },
  resetPassword: async ({ body }) => {
    const { email } = body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          status: 404,
          body: {
            field: "email",
            msg: "User not found",
          },
        };
      }

      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = Date.now() + 3600000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

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
             ${process.env.CORS_URI}/change-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
      await transporter.sendMail(mailOptions);
      return {
        status: 200,
        body: {
          msg: "Password reset mail sent.",
        },
      };
    } catch (err) {
      console.error("Error resetting password:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to reset your password. Please try again later.",
        },
      };
    }
  },
  changePassword: async ({ body }) => {
    const { password, resetToken } = body;

    if (!resetToken) {
      return {
        status: 400,
        body: {
          msg: "Reset token is invalid or has expired.",
        },
      };
    }

    try {
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return {
          status: 400,
          body: {
            msg: "Reset token is invalid or has expired.",
          },
        };
      }
      user.setPassword(password);

      return {
        status: 200,
        body: {
          msg: "Password changed successfully.",
        },
      };
    } catch (err) {
      console.error("Error changing password:", err);

      return {
        status: 500,
        body: {
          msg: "We failed to change your password. Please try again later.",
        },
      };
    }
  },
  checkUserSession: async ({ req, res }) => {
    try {
      const userId = await getDataFromToken(req, res);

      if (!userId) {
        return {
          status: 200,
          body: {
            msg: "User session is inactive",
            state: false,
          },
        };
      }
      return {
        status: 200,
        body: {
          msg: "User session is active",
          state: true,
        },
      };
    } catch (err) {
      console.error("Error checking user session:", err);

      return {
        status: 500,
        body: {
          msg: "We failed to check your session. Please try again later.",
        },
      };
    }
  },
  deleteUser: async ({ body }) => {
    const { _id } = body;
    try {
      const deletedUser = await User.findByIdAndUpdate(
        { _id },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
      if (!deletedUser) {
        return {
          status: 404,
          body: {
            msg: "User not found",
          },
        };
      }
      return {
        status: 200,
        body: {
          msg: "User deleted",
        },
      };
    } catch (err) {
      console.error("Error deleting user:", err);
      return {
        status: 500,
        body: {
          msg: "We failed to delete your account. Please try again later.",
        },
      };
    }
  },
});
