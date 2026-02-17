import { DataTypes } from "sequelize";
import { sequalize } from "../config/sequalize.js";

export const CandidateSkill = sequalize.define(
  "CandidateSkill",
  {
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    skill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "candidate_skills",
    timestamps: false,
  }
);
