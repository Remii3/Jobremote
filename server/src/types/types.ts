import { z } from "zod";
import { UserSchema } from "../schemas/userSchemas";
import { OfferSortOptionsSchema } from "../schemas/offerSchemas";

export type UserTypes = z.infer<typeof UserSchema>;
export type UserFormTypes = z.infer<typeof UserSchema> & {
  passwordRepeat: string;
};
