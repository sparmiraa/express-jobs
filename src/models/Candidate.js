import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const Candidate = sequalize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
    },

    city_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    bio: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    salary_from: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    salary_to: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    birthday: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "candidates",
    createdAt: true,
    updatedAt: false,
  },
);
