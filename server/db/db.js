const Sequelize = require("sequelize");
const pkg = require("../../package.json");
require('dotenv').config();

const databaseName =
  pkg.name + (process.env.NODE_ENV === "test" ? "-test" : "");

const config = {
  logging: false,
};

if (process.env.LOGGING === "true") {
  delete config.logging;
}

// if (process.env.DATABASE_URL) {
//   config.dialectOptions = {
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   };
// }

console.log(process.env.DATABASE_URL)
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost/${databaseName}`,
  config
);
module.exports = db;
