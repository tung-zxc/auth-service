import {} from "pg";
import Knex from "knex";

export class AuthService {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }
}
