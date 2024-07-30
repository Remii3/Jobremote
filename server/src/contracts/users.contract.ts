import { UserSchema } from "../schemas/offerSchemas";
import { z } from "zod";
import { c } from "../utils/utils";

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user",
    responses: {
      201: UserSchema,
    },
    body: z.string(),
    summary: "Create a user",
  },
});
