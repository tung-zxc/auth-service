import * as jwt from "./jwt";
import { AuthService } from ".";
import { AuthToken } from "./tables";
import { UnknownError } from "./errors";

export interface AuthenticateParams {
  userId: string;
  token: string;
}

export async function authenticate(
  this: AuthService,
  { userId, token }: AuthenticateParams
): Promise<true> {
  try {
    const tokenPayload = await jwt.verify(token, this.secret);
    console.log(tokenPayload);
    await this.knex.transaction(async trx => {
      const tokenResult = await trx<AuthToken>(AuthToken)
        .select("id")
        .where("userId", userId)
        .where("id", tokenPayload.tokenId)
        .limit(1);
      if (tokenResult.length !== 1) throw new Error();
    });
    if (tokenPayload.userId !== userId) throw new Error();
    if (this.tokenExpireTimeMs != null) {
      const now = new Date();
      if (+now - +new Date(tokenPayload.iat) > this.tokenExpireTimeMs) {
        throw new Error();
      }
    }
    return true;
  } catch {
    throw UnknownError();
  }
}
