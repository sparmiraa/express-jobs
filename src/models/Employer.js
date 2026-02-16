import { DataTypes } from "sequelize";
import { sequalize } from "../sequalize/sequalize.js";

export const Employer = sequalize.define(
  "Employer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "employers",
    createdAt: true,
    updatedAt: false,
  }
);
