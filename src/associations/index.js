import { User } from "../models/User.js";
import { Role } from "../models/Role.js";

import { Candidate } from "../models/Candidate.js";
import { CandidateExperience } from "../models/CandidateExperience.js";
import { CandidateSkill } from "../models/CandidateSkill.js";

import { Skill } from "../models/Skill.js";
import { City } from "../models/City.js";

import { Employer } from "../models/Employer.js";
import { EmployerType } from "../models/EmployerType.js";

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

User.hasOne(Candidate, { foreignKey: "user_id" });
Candidate.belongsTo(User, { foreignKey: "user_id" });

City.hasMany(Candidate, { foreignKey: "city_id" });
Candidate.belongsTo(City, { foreignKey: "city_id" });

Candidate.hasMany(CandidateExperience, {
  foreignKey: "candidate_id",
  onDelete: "CASCADE",
});
CandidateExperience.belongsTo(Candidate, { foreignKey: "candidate_id" });

Candidate.belongsToMany(Skill, {
  through: CandidateSkill,
  foreignKey: "candidate_id",
  otherKey: "skill_id",
});
Skill.belongsToMany(Candidate, {
  through: CandidateSkill,
  foreignKey: "skill_id",
  otherKey: "candidate_id",
});

City.hasMany(Employer, { foreignKey: "city_id" });
Employer.belongsTo(City, { foreignKey: "city_id" });

EmployerType.hasMany(Employer, { foreignKey: "type_id" });
Employer.belongsTo(EmployerType, { foreignKey: "type_id" });
