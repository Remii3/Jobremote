import { userContract } from "../contracts/users.contract";
import { tsServer } from "../utils/utils";

export const usersRouter = tsServer.router(userContract, {
  createUser: async ({ body }) => {
    return {
      status: 201,
      body: body,
    };
  },
});
