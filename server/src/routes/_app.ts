import { mainContract } from "../contracts/_app";
import { tsServer } from "../utils/utils";
import { offersRouter } from "./offers.router";
import { usersRouter } from "./users.router";

export const mainRouter = tsServer.router(mainContract, {
  offers: offersRouter,
  users: usersRouter,
});
