import * as express from "express";
import { UserPayload } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
