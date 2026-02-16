import { DataTypes } from "sequelize";
import { sequalize } from "../sequalize/sequalize.js";

export const CandidateExperience = sequalize.define(
  "CandidateExperience",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    job_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bio: {
      type: DataTypes.TEXT,
    },

    date_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    date_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "candidate_experiences",
    timestamps: false,
  }
);
