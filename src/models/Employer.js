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

    shortBio: {
      field: 'short_bio',
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    bio: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    city_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    type_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },

    employees_count: { type: DataTypes.INTEGER, defaultValue: null },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "employers",
    createdAt: true,
    updatedAt: false,
  },
);
