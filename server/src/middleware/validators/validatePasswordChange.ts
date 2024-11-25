import { NextFunction, Request, Response } from "express";
import { PasswordChange } from "../../types/controllers";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const PasswordChangeSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
  resetToken: z.string(),
});

export function validatePasswordChange(
  req: Request<{}, {}, PasswordChange>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = PasswordChangeSchema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

export function sanitizePasswordChange(
  req: Request<{}, {}, PasswordChange>,
  res: Response,
  next: NextFunction
) {
  const { password, resetToken } = req.body;

  const sanitizedBody = {
    password: sanitizeHtml(password, {
      allowedAttributes: {},
      allowedTags: [],
    }),
    resetToken: sanitizeHtml(resetToken, {
      allowedAttributes: {},
      allowedTags: [],
    }),
  };

  req.body = sanitizedBody;
  next();
}
