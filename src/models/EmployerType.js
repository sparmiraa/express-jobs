import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const EmployerType = sequalize.define(
  "EmployerType",
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
    tableName: "employer_types",
    timestamps: false,
  }
);
