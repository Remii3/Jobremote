import { NextFunction, Request, Response } from "express";
import { PayForOffer } from "../../types/controllers";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const PayForOfferSchema = z.object({
  offerId: z.string(),
  title: z.string(),
  currency: z.string(),
});

export function validatePayForOffer(
  req: Request<{}, {}, PayForOffer>,
  res: Response,
  next: NextFunction
) {
  try {
    req.body = PayForOfferSchema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

export function sanitizePayForOffer(
  req: Request<{}, {}, PayForOffer>,
  res: Response,
  next: NextFunction
) {
  const sanitizedBody: PayForOffer = {
    currency: sanitizeHtml(req.body.currency),
    offerId: sanitizeHtml(req.body.offerId),
    title: sanitizeHtml(req.body.title),
  };

  req.body = sanitizedBody;

  next();
}
