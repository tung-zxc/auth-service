const { DB_URL } = require("./config.js");

module.exports = {
  client: "postgresql",
  connection: DB_URL
};
