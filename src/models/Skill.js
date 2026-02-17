import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const Skill = sequalize.define(
  "Skill",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "skills",
    timestamps: false,
  }
);
