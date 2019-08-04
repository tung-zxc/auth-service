import { AuthService } from "./src";
import Knex from "knex";
import express from "express";
const { DB_URL, SCHEMA_NAME } = require("./config");

const knex = Knex({
  client: "postgresql",
  connection: DB_URL,
  searchPath: [SCHEMA_NAME, "public"]
});

const authService = new AuthService({ knex, secret: "secret" });

const app = express();

app.get("/", (_req, res) => {
  res.send("ping");
});

app.get("/register", async (req, res) => {
  const { username, password } = req.query;
  try {
    const user = await authService.register({ username, password });
    res.send(JSON.stringify(user));
  } catch {
    res.status(500);
    res.send("error");
  }
});

app.get("/login", async (req, res) => {
  const { username, password } = req.query;
  try {
    const result = await authService.login({ username, password });
    res.send(JSON.stringify(result));
  } catch {
    res.status(500);
    res.send("error");
  }
});

// eslint-disable-next-line no-console
app.listen(3000, () => console.log("test server started at port 3000"));
