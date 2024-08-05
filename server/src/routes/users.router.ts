import { userContract } from "../contracts/users.contract";
import { User } from "../models/User.model";
import { UserFormSchema } from "../schemas/userSchemas";
import { getDataFromToken, tsServer } from "../utils/utils";
import { hashSync, compareSync, genSaltSync, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export const usersRouter = tsServer.router(userContract, {
  createUser: async ({ body }) => {
    UserFormSchema.parse(body);
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
            errorField: user.email === email ? "email" : "username",
          },
        };
      }
      const salt = genSaltSync(10);
      const passwordHash = hashSync(password, salt);

      await User.create({
        email,
        password: passwordHash,
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
      return {
        status: 500,
        body: {
          msg: "We failed to add your new user.",
        },
      };
    }
  },
  loginUser: async ({ query, res }) => {
    const { username, password } = query;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return {
          status: 404,
          body: {
            msg: "User not found",
          },
        };
      }
      const isPasswordCorrect = compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return {
          status: 404,
          body: {
            msg: "Password not correct",
          },
        };
      }

      const tokenData = {
        email: user.email,
        _id: user._id,
      };
      const token = sign(tokenData, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      console.log("token: ", token);
      res.cookie("token", token, {
        httpOnly: true,
      });
      return {
        status: 200,
        body: {
          msg: "User logged in",
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
  getUser: async ({ req }) => {
    try {
      const userId = await getDataFromToken(req);

      const user = await User.findById(userId).select("-password");
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
      console.log("err: ", err);
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
});
