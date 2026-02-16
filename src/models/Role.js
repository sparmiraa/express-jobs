import { DataTypes } from "sequelize";
import { sequalize } from "../sequalize/sequalize.js";

export const Role = sequalize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);
