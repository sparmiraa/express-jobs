import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const Employer = sequalize.define(
  "Employer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    city_id: {
      type: DataTypes.INTEGER,
    },

    type_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "employers",
    createdAt: true,
    updatedAt: false,
  }
);
