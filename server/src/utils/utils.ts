import { TRPCError } from "@trpc/server";

export function handleError(err: unknown, message?: string): never {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  if (err instanceof TRPCError) {
    throw new TRPCError({
      code: err.code,
      message: message || err.message,
      cause: err.cause,
    });
  } else {
    throw err;
  }
}
