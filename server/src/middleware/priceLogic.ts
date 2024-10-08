import { NextFunction, Request, Response } from "express";
import { PaymentModel } from "../models/PaymentType.model";

export async function priceLogic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const price = await PaymentModel.findOne({ code: req.body.pricing }).select(
      "price"
    );
    if (!price) {
      next(new Error("Pricing code not found."));
    } else {
      res.locals.price = price.price * 100;
      next();
    }
  } catch (err) {
    next(
      new Error(
        "An error occurred while fetching the offer price. Please try again later."
      )
    );
  }
}
