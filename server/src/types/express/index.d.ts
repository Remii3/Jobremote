import * as express from "express";
import { UserPayload } from "../types";

declare module "express" {
  interface Request {
    userId?: string;
  }
}

declare module "express-session" {
  interface Session {
    refreshToken?: string; // Add custom properties here
  }
}
