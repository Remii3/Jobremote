import { NextFunction, Request, Response } from "express";
import { PaymentModel } from "../models/PaymentType.model";

export async function priceLogic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payment = await PaymentModel.findOne({
      code: req.body.pricing,
    })
      .select({ price: 1, activeMonths: 1 })
      .lean();
    if (!payment) {
      next(new Error("Pricing code not found."));
    } else {
      res.locals.price = payment.price * 100;
      res.locals.activeMonths = payment.activeMonths;
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
