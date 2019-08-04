import Knex from "knex";
import { register, RegisterParams } from "./register";

interface ServiceOptions {
  knex: Knex;
  secret: string;
  saltRound?: number;
}

export class AuthService {
  knex: Knex;
  secret: string;
  saltRound: number;

  constructor({ knex, secret, saltRound = 10 }: ServiceOptions) {
    this.knex = knex;
    this.secret = secret;
    this.saltRound = saltRound;
  }

  register: (
    params: RegisterParams
  ) => ReturnType<typeof register> = register.bind(this);
}
