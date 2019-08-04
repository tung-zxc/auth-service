const { SCHEMA_NAME } = require("../config");

exports.up = async function(knex) {
  await knex.schema.raw("CREATE SCHEMA IF NOT EXISTS " + SCHEMA_NAME);
  await knex.schema.raw("SET search_path TO " + SCHEMA_NAME + ", public");
  await knex.schema
    .withSchema(SCHEMA_NAME)
    .createTable("_auth_user", function(table) {
      table.text("id").notNullable();
      table
        .text("username")
        .notNullable()
        .unique();
      table.text("password").notNullable();
      table.primary(["id", "username"]);
    });
};

exports.down = async function(knex) {
  await knex.schema.raw("DROP SCHEMA IF EXISTS " + SCHEMA_NAME + " CASCADE");
};
