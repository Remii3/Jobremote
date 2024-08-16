import { userContract } from "./users.contract";
import { offersContract } from "./offers.contract";
import { c } from "../utils/utils";

export const mainContract = c.router({
  offers: offersContract,
  users: userContract,
});
