import { z } from "zod";
import { UserSchema } from "jobremotecontracts/dist/schemas/userSchemas";

export type UserTypes = z.infer<typeof UserSchema>;
export type UserFormTypes = z.infer<typeof UserSchema> & {
  passwordRepeat: string;
};
