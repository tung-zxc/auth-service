import * as jwt from "./jwt";
import { AuthService } from ".";
import { AuthToken } from "./tables";
import { UnknownError } from "./errors";

export interface LogoutParams {
  userId: string;
  token: string;
}

export async function logout(
  this: AuthService,
  { userId, token }: LogoutParams
): Promise<true> {
  try {
    const tokenPayload = await jwt.verify(token, this.secret);
    await this.knex.transaction(async trx => {
      return trx<AuthToken>(AuthToken)
        .where("userId", userId)
        .where("id", tokenPayload.tokenId)
        .delete();
    });
    return true;
  } catch {
    throw UnknownError();
  }
}
