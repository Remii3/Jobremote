import { NextFunction, Request, Response } from "express";

export function priceLogic(req: Request, res: Response, next: NextFunction) {
  switch (req.body.pricing) {
    case "basic":
      res.locals.price = 100;
      break;
    case "standard":
      res.locals.price = 200;
      break;
    case "premium":
      res.locals.price = 300;
      break;
    default:
      res.locals.price = null;
  }
  next();
}
