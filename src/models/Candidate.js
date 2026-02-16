import { DataTypes } from "sequelize";
import { sequalize } from "../sequalize/sequalize.js";

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
      allowNull: false,
    },

    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    salary_from: {
      type: DataTypes.INTEGER,
    },

    salary_to: {
      type: DataTypes.INTEGER,
    },

    birthday: {
      type: DataTypes.DATE,
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
  }
);
