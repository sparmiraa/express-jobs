import { Sequelize } from "sequelize";
import { env } from "../config/env.config.js";

export const sequalize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,

  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);
