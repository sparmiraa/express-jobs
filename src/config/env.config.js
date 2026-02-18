import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PHONE_NUMBER: process.env.ADMIN_PHONE_NUMBER,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  TIME_TO_LIVE_REFRESH_TOKEN: process.env.TIME_TO_LIVE_REFRESH_TOKEN,
};
