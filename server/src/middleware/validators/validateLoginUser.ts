import { NextFunction, Request, Response } from "express";
import { LoginUser } from "../../types/controllers";
import { z, ZodError } from "zod";
import sanitizeHtml from "sanitize-html";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(5, { message: "Email needs to have at least 5 characters." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(128, { message: "Password cannot exceed 128 characters." }),
});

export function validateLoginUser(
  req: Request<{}, {}, LoginUser>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    req.body = loginSchema.parse({ email, password });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const formattedErrors = err.errors.map((err) => ({
        msg: err.message,
        field: err.path[0],
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next(err);
  }
}

export function sanitizeLoginUser(
  req: Request<{}, {}, LoginUser>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  req.body.email = sanitizeHtml(email, {
    allowedTags: [],
    allowedAttributes: {},
  });
  req.body.password = sanitizeHtml(password, {
    allowedTags: [],
    allowedAttributes: {},
  });

  next();
}
