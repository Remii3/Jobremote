import { initContract } from "@ts-rest/core";
import { initServer } from "@ts-rest/express";

export function handleError(err: unknown, message?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export const tsServer = initServer();

export const c = initContract();
