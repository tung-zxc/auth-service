import jwt from "jsonwebtoken";
import { TokenPayload, isTokenPayload } from "./types";

const UnexpectedPayload = "unexpected payload";

export async function sign(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  return jwt.sign(payload, secret, { noTimestamp: true });
}

export async function verify(
  token: string,
  secret: string
): Promise<TokenPayload> {
  const payload = jwt.verify(token, secret);
  if (!isTokenPayload(payload)) throw new Error(UnexpectedPayload);
  return payload;
}
