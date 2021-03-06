import * as jwt from "./jwt";
import { AuthService } from ".";
import { AuthToken, AuthUser } from "./tables";
import { UnknownError, AuthServiceError, AuthenticationError } from "./errors";

export interface AuthenticateParams {
  username: string;
  token: string;
}

export async function authenticate(
  this: AuthService,
  { username, token: jwtToken }: AuthenticateParams
): Promise<true> {
  try {
    const tokenPayload = await jwt.verify(jwtToken, this.secret).catch(_e => {
      throw AuthenticationError();
    });
    const token = await this.knex.transaction(
      async (trx): Promise<AuthToken> => {
        const tokenResult = await trx<AuthToken>(`${AuthToken} AS at`)
          .select("at.*")
          .leftJoin(`${AuthUser} AS au`, "au.id", "at.userId")
          .where("au.username", username)
          .where("at.id", tokenPayload.tokenId)
          .limit(1);
        if (tokenResult.length !== 1) throw AuthenticationError();
        return tokenResult[0];
      }
    );
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
