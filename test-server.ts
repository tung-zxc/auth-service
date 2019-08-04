import { AuthService } from "./src";
import Knex from "knex";
import express from "express";
const { DB_URL, SCHEMA_NAME } = require("./config");

const knex = Knex({
  client: "postgresql",
  connection: DB_URL,
  searchPath: [SCHEMA_NAME, "public"]
});

// @ts-ignore
// eslint-disable-next-line
const authService = new AuthService(knex);

const app = express();

app.get("/", (_req, res) => {
  res.send("ping");
});

// eslint-disable-next-line no-console
app.listen(8080, () => console.log("test server started at port 8080"));
