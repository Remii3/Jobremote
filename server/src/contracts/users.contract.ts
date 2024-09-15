import {
  ChangeUserPasswordSchema,
  LoginUserSchema,
  PublicUserSchema,
  RegisterUserSchema,
  UserSchema,
} from "../schemas/userSchemas";
import { z } from "zod";
import { c } from "../utils/utils";

const loginFields = z.enum(["email", "password"]);

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user/register",
    responses: {
      201: RegisterUserSchema,
      404: z.object({
        msg: z.string(),
        field: z.enum(["email"]),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    body: RegisterUserSchema,
    summary: "Create a user",
  },
  updateUser: {
    method: "PUT",
    path: "/user-update",
    body: UserSchema.pick({
      name: true,
      description: true,
      password: true,
    })
      .partial()
      .extend({ _id: z.string() }),
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
  },
  updateSetings: {
    method: "PUT",
    path: "/user/settings",
    body: UserSchema.pick({ commercialConsent: true }).partial().extend({
      userId: z.string(),
    }),
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
  },
  loginUser: {
    method: "POST",
    path: "/user/login",
    responses: {
      200: z.object({
        msg: z.string(),
        data: UserSchema.pick({ email: true }),
      }),
      401: z.object({
        field: loginFields,
        msg: z.string(),
      }),
      403: z.object({
        field: loginFields,

        msg: z.string(),
      }),
      404: z.object({
        field: loginFields,

        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    body: LoginUserSchema,
  },
  resetPassword: {
    method: "POST",
    path: "/user/reset-password",
    body: UserSchema.pick({ email: true }),
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      404: z.object({
        field: z.enum(["email"]),
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
  },
  changePassword: {
    method: "POST",
    path: "/user/change-password",
    body: ChangeUserPasswordSchema,
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      400: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
  },
  getUser: {
    method: "GET",
    path: "/user",
    responses: {
      200: z.object({
        user: PublicUserSchema,
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
  checkUserSession: {
    method: "GET",
    path: "/user/check-session",
    responses: {
      200: z.object({
        state: z.boolean(),
      }),
      500: z.object({ msg: z.string() }),
    },
  },
  logoutUser: {
    method: "POST",
    path: "/user/logout",
    responses: {
      200: z.object({
        msg: z.string(),
      }),
      500: z.object({
        msg: z.string(),
      }),
    },
    body: z.object({}),
  },
});
