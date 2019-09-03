import * as jwt from "./jwt";
import { AuthService } from ".";
import { AuthToken } from "./tables";
import { UnknownError, AuthServiceError, AuthenticationError } from "./errors";

export interface AuthenticateParams {
  userId: string;
  token: string;
}

export async function authenticate(
  this: AuthService,
  { userId, token }: AuthenticateParams
): Promise<true> {
  try {
    const tokenPayload = await jwt.verify(token, this.secret).catch(() => {
      throw AuthenticationError();
    });
    await this.knex.transaction(async trx => {
      const tokenResult = await trx<AuthToken>(AuthToken)
        .select("id")
        .where("userId", userId)
        .where("id", tokenPayload.tokenId)
        .limit(1);
      if (tokenResult.length !== 1) throw AuthenticationError();
    });
    if (tokenPayload.userId !== userId) throw AuthenticationError();
    if (this.tokenExpireTimeMs != null) {
      const now = new Date();
      if (+now - +new Date(tokenPayload.iat) > this.tokenExpireTimeMs) {
        throw AuthenticationError();
      }
    }
    return true;
  } catch (e) {
    if (e instanceof AuthServiceError) throw e;
    throw UnknownError();
  }
}
