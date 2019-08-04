import bcrypt from "bcrypt";
import uuid from "uuid";
import jwt from "jsonwebtoken";
import { AuthService } from ".";
import { AuthUser } from "./tables";
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
    const token = await jwt.sign(
      {
        tokenId: tokenId,
        userId: user.id,
        username: user.username,
        signDate: now.toISOString()
      },
      this.secret
    );
    return token;
  } catch {
    throw UnknownError();
  }
}
