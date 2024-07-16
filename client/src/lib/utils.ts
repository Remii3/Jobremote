import { TRPCClientError } from "@trpc/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  if (err instanceof TRPCClientError) {
    return err;
  } else {
    return err;
  }
}
