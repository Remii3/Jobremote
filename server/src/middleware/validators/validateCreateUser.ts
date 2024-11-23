import { NextFunction, Request, Response } from "express";
import { CreateUser } from "../../types/controllers";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(5, { message: "Email needs to have at least 5 characters." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
  passwordRepeat: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
  commercialConsent: z.boolean(),
  privacyPolicyConsent: z.boolean(),
});

export function validateCreateUser(
  req: Request<{}, {}, CreateUser>,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.body.password !== req.body.passwordRepeat) {
      return res.status(400).json({
        msg: "Passwords do not match.",
        field: "passwordRepeat",
      });
    }

    req.body = registerSchema.parse(req.body);

    next();
  } catch (err) {
    next(err);
  }
}

export function sanitizeCreateUser(
  req: Request<{}, {}, CreateUser>,
  res: Response,
  next: NextFunction
) {
  const {
    email,
    password,
    passwordRepeat,
    commercialConsent,
    privacyPolicyConsent,
  } = req.body;

  const sanitizedBody = {
    email: sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    password: sanitizeHtml(password, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    passwordRepeat: sanitizeHtml(passwordRepeat, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    commercialConsent: Boolean(commercialConsent),
    privacyPolicyConsent: Boolean(privacyPolicyConsent),
  };

  req.body = sanitizedBody;

  next();
}
