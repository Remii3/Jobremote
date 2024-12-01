import { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";
import { OfferApply } from "../../types/controllers";
import { z } from "zod";

const OfferApplySchema = z.object({
  offerId: z.string(),
  email: z.string().email(),
  userId: z.string(),
  description: z.string(),
  name: z.string(),
});

export function validateOfferApply(
  req: Request<{}, {}, OfferApply>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = OfferApplySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
}

export function sanitizeOfferApply(
  req: Request<{}, {}, OfferApply>,
  res: Response,
  next: NextFunction
) {
  const sanitizedBody: OfferApply = {
    description: sanitizeHtml(req.body.description),
    email: sanitizeHtml(req.body.email),
    name: sanitizeHtml(req.body.name),
    offerId: sanitizeHtml(req.body.offerId),
    userId: sanitizeHtml(req.body.userId),
  };

  req.body = sanitizedBody;

  next();
}
