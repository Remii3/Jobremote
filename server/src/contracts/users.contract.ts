import { BaseUserFormSchema, UserSchema } from "../schemas/userSchemas";
import { z } from "zod";
import { c } from "../utils/utils";

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user/register",
    responses: {
      201: BaseUserFormSchema.pick({
        email: true,
        password: true,
        passwordRepeat: true,
        privacyPolicyConsent: true,
        commercialConsent: true,
      }),
      404: z.object({
        msg: z.string(),
        errorField: z.string().optional(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    body: BaseUserFormSchema.pick({
      email: true,
      password: true,
      passwordRepeat: true,
      privacyPolicyConsent: true,
      commercialConsent: true,
    }),
    summary: "Create a user",
  },
  loginUser: {
    method: "GET",
    path: "/user/login",
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      404: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    query: z.object({
      username: z.string(),
      password: z.string(),
    }),
  },
  getUser: {
    method: "GET",
    path: "/user",
    responses: {
      200: z.object({
        user: UserSchema,
      }),
      404: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },

    summary: "Get a user",
  },
  logoutUser: {
    method: "GET",
    path: "/user/logout",
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
  },
});
