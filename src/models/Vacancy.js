import {DataTypes} from "sequelize";
import {sequalize} from "../config/sequalize.js";

export const Vacancy = sequalize.define(
  "Vacancy",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    employer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city_id: {
      type: DataTypes.INTEGER,
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

    required_text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    plus_text: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    responsibilities: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    assumptions: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "vacancies",
    createdAt: true,
    updatedAt: false,
  }
);