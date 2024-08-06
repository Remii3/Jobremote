import { initQueryClient } from "@ts-rest/react-query";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mainContract } from "../../../server/src/contracts/_app";

interface ClientErrorType {
  status: number;
  body: string | unknown;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showError(err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export const client = initQueryClient(mainContract, {
  baseUrl: "http://localhost:5000",
  baseHeaders: {},
  credentials: "include",
});
