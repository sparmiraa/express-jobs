import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const VacancySkill = sequalize.define(
  "VacancySkill",
  {
    vacancy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "vacancies_skills",
    timestamps: false,
  }
);