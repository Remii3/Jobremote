import { userContract } from "./users.contract";
import { offersContract } from "./offers.contract";
import { c } from "../utils/utils";
import { jobPositionsContract } from "./jobPositions.contract";

export const mainContract = c.router({
  offers: offersContract,
  users: userContract,
  jobPositions: jobPositionsContract,
});
