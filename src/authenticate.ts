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
  { userId, token: jwtToken }: AuthenticateParams
): Promise<true> {
  try {
    const tokenPayload = await jwt.verify(jwtToken, this.secret).catch(_e => {
      throw AuthenticationError();
    });
    const token = await this.knex.transaction(
      async (trx): Promise<AuthToken> => {
        const tokenResult = await trx<AuthToken>(AuthToken)
          .select("*")
          .where("userId", userId)
          .where("id", tokenPayload.tokenId)
          .limit(1);
        if (tokenResult.length !== 1) throw AuthenticationError();
        return tokenResult[0];
      }
    );
    if (token.userId !== userId) throw AuthenticationError();
    if (this.tokenExpireTimeMs != null) {
      const now = new Date();
      if (+now - +new Date(token.sign_date) > this.tokenExpireTimeMs) {
        throw AuthenticationError();
      }
    }
    return true;
  } catch (e) {
    if (e instanceof AuthServiceError) throw e;
    throw UnknownError();
  }
}
