import { env } from "./src/config/env.config.js";
import express from "express";
import { initializeDB } from "./src/seeders/initializeDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./src/routes/index.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

import "./src/models/index.js"

const PORT = env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use("/api", router);
app.use(errorMiddleware);

(async () => {
  try {
    await initializeDB();

    app.listen(PORT, () => console.log("started"));
  } catch (e) {
    console.log(e);
  }
})();
