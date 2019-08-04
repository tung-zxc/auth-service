import Knex from "knex";
import { register, RegisterParams } from "./register";
import { login, LoginParams } from "./login";
import { authenticate, AuthenticateParams } from "./authenticate";
import { ErrorCodes } from "./errors";

interface ServiceOptions {
  knex: Knex;
  secret: string;
  saltRound?: number;
  tokenExpireTimeMs?: number | null;
}

export class AuthService {
  readonly knex: Knex;
  readonly secret: string;
  readonly saltRound: number;
  readonly tokenExpireTimeMs: number | null;

  constructor({
    knex,
    secret,
    saltRound = 10,
    tokenExpireTimeMs = null
  }: ServiceOptions) {
    this.knex = knex;
    this.secret = secret;
    this.saltRound = saltRound;
    this.tokenExpireTimeMs = tokenExpireTimeMs;
  }

  register: (
    params: RegisterParams
  ) => ReturnType<typeof register> = register.bind(this);

  login: (params: LoginParams) => ReturnType<typeof login> = login.bind(this);

  authenticate: (
    params: AuthenticateParams
  ) => ReturnType<typeof authenticate> = authenticate.bind(this);
}

export { ErrorCodes };
