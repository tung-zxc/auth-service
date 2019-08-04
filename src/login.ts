import bcrypt from "bcrypt";
import uuid from "uuid";
import * as jwt from "./jwt";
import { AuthService } from ".";
import { AuthUser, AuthToken } from "./tables";
import { TokenPayload } from "./types";
import { UnknownError } from "./errors";

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(
  this: AuthService,
  { username, password }: LoginParams
) {
  try {
    const user = await this.knex.transaction(async trx => {
      const userResult = await trx<AuthUser>(AuthUser)
        .select(["id", "password", "username"])
        .where("username", username)
        .limit(1);
      if (userResult.length !== 1) throw new Error();
      const user = userResult[0];
      return user;
    });
    const authResult = await bcrypt.compare(password, user.password);
    if (!authResult) throw new Error();
    const tokenId = uuid.v4();
    const now = new Date();
    const tokenPayload: TokenPayload = {
      tokenId: tokenId,
      userId: user.id,
      username: user.username,
      iat: +now
    };
    const token = await jwt.sign(tokenPayload, this.secret);
    await this.knex.transaction(async trx => {
      return trx<AuthToken>(AuthToken).insert({
        id: tokenId,
        userId: user.id,
        sign_date: now
      });
    });
    return token;
  } catch {
    throw UnknownError();
  }
}
