import { sequalize } from "./sequalize.js";

export const initializeDB = async () => {
  try {
    await sequalize.authenticate();
    await sequalize.sync({ force: false });

    console.log("success");
  } catch (e) {
    throw e;
  }
};
