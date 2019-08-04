import uuid from "uuid";
import bcrypt from "bcrypt";
import { AuthService } from ".";
import { AuthUser } from "./tables";
import { UnknownError } from "./errors";

export interface RegisterParams {
  username: string;
  password: string;
}

export async function register(
  this: AuthService,
  { username, password }: RegisterParams
): Promise<AuthUser> {
  try {
    const userId = uuid.v4();
    const hashedPassword = await bcrypt.hash(password, this.saltRound);
    return await this.knex.transaction(async trx => {
      const result = await trx<AuthUser>(AuthUser)
        .insert({
          id: userId,
          username,
          password: hashedPassword
        })
        .returning(["id", "username", "password"]);
      if (result.length !== 1) throw new Error();
      return result[0];
    });
  } catch {
    throw UnknownError();
  }
}
