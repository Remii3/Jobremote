import { compare, genSalt, hash } from "bcrypt";

export function handleError(err: unknown, message?: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export async function genPassword(plainPassword: string) {
  const salt = await genSalt(10);
  return await hash(plainPassword, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
) {
  return await compare(plainPassword, hashedPassword);
}
