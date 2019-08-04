const { SCHEMA_NAME } = require("../config");

exports.up = async function(knex) {
  await knex.schema
    .withSchema(SCHEMA_NAME)
    .createTable("_auth_token", function(table) {
      table
        .text("id")
        .notNullable()
        .unique();
      table
        .text("userId")
        .notNullable()
        .references("id")
        .inTable(`${SCHEMA_NAME}._auth_user`);
      table.timestamp("sign_date", { useTz: false }).notNullable();
      table.primary(["id"]);
    });
};

exports.down = async function(knex) {
  await knex.schema.withSchema(SCHEMA_NAME).dropTable("_auth_token");
};
