import {runSeeds} from "./index.js";
import {sequalize} from "../config/sequalize.js";

export const initializeDB = async () => {
  try {
    await sequalize.authenticate();
    await sequalize.sync({force: false, alter: true});

    await runSeeds();

    console.log("success");
  } catch (e) {
    throw e;
  }
};
