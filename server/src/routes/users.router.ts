import { userContract } from "../contracts/users.contract";
import { User } from "../models/User.model";
import { getDataFromToken, tsServer } from "../utils/utils";
import { hashSync, compareSync, genSaltSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { createTransport } from "nodemailer";

export const usersRouter = tsServer.router(userContract, {
  createUser: async ({ body }) => {
    const {
      email,
      password,
      commercialConsent,
      privacyPolicyConsent,
      passwordRepeat,
    } = body;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return {
          status: 404,
          body: {
            msg: "User already exists",
            field: "email",
          },
        };
      }
      const salt = genSaltSync(10);
      const passwordHash = hashSync(password, salt);

      await User.create({
        email,
        password: passwordHash,
        description: "",
        name: "",
        commercialConsent,
        privacyPolicyConsent,
      });
      return {
        status: 201,
        body: {
          email,
          password: passwordHash,
          commercialConsent,
          privacyPolicyConsent,
          passwordRepeat,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        body: {
          msg: "We failed to add your new account.",
        },
      };
    }
  },
  updateUser: async ({ body }) => {
    const { _id, ...updatedFieldsValues } = body;
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id },
        { ...updatedFieldsValues },
        { new: true }
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
      console.error(err);
      return {
        status: 500,
        body: {
          msg: "We failed to update your account.",
        },
      };
    }
  },
  updateSetings: async ({ body, req, res }) => {
    const { userId, ...updatedSettings } = body;
    try {
      const updateStatus = await User.findByIdAndUpdate(
        userId,
        { ...updatedSettings },
        { new: true }
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
      const isPasswordCorrect = compareSync(password, user.password);
      if (!isPasswordCorrect) {
        user.loginAttempts += 1;

        const invalidPasswordMsg = `Invalid password. You have ${
          maxAttempts - user.loginAttempts
        } attempt(s) left.`;

        if (user.loginAttempts >= maxAttempts) {
          user.lockUntil = Date.now() + 2 * 60 * 60 * 1000;
          user.loginAttempts = 0;
          user.lockCount += 1;
        }

        if (user.lockCount >= 3) {
          user.banned = true;
        }

        await user.save();

        if (user.isLocked() || user.loginAttempts >= maxAttempts - 2) {
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

      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lockCount = 0;

      await user.save();

      const tokenData = {
        _id: user._id,
      };
      const token = sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
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
      console.error(err);
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
        createdOffers: 1,
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
      return {
        status: 200,
        body: {
          user,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        body: {
          msg: "We failed to get your user data.",
        },
      };
    }
  },
  logoutUser: async ({ res }) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return {
      status: 200,
      body: {
        msg: "User logged out",
      },
    };
  },
  resetPassword: async ({ body, req }) => {
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
        service: "gmail",
        secure: false,
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
             http://localhost:3000/change-password/${resetToken}\n\n
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
      console.error(err);
      return {
        status: 500,
        body: {
          msg: "We failed to reset your password.",
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
      user.password = hashSync(password, genSaltSync(10));
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      user.lockUntil = undefined;
      user.banned = false;
      user.lockCount = 0;
      await user.save();

      return {
        status: 200,
        body: {
          msg: "Password changed successfully.",
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to change your password.",
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
            state: false,
          },
        };
      }
      return {
        status: 200,
        body: {
          state: true,
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: {
          msg: "We failed to check your session.",
        },
      };
    }
  },
});
