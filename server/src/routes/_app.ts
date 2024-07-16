import { mergeRouters } from "../utils/trpc";
import { offersRouter } from "./offers";

export const mainRouter = mergeRouters(offersRouter);

export type AppRouter = typeof mainRouter;
