import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", err); // Log the error for debugging purposes

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    const formattedErrors = err.errors.map((error) => ({
      msg: error.message, // Custom error message
      field: error.path[0], // Field that caused the error
    }));

    return res.status(400).json({
      errors: formattedErrors,
    });
  }

  // Handle other application-specific errors
  if (err.status && err.message) {
    return res.status(err.status).json({
      msg: err.message,
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    msg: "An unexpected error occurred.",
  });
}
