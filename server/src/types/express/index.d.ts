import * as express from "express";
import { UserPayload } from "../types";

declare module "express-session" {
  interface Session {
    userId?: string; // Add custom properties here
  }
}
