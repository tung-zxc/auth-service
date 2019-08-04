import jwt from "jsonwebtoken";
import { TokenPayload } from "./types";

export async function sign(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  return jwt.sign(payload, secret);
}
