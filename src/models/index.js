import { User } from "./User.js";
import { Role } from "./Role.js";

import { Candidate } from "./Candidate.js";
import { CandidateExperience } from "./CandidateExperience.js";
import { CandidateSkill } from "./CandidateSkill.js";

import { Skill } from "./Skill.js";
import { City } from "./City.js";

import { Employer } from "./Employer.js";
import { EmployerType } from "./EmployerType.js";

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

User.hasOne(Employer, { foreignKey: "user_id", as: "employer" });
Employer.belongsTo(User, { foreignKey: "user_id", as: "user" });

EmployerType.hasMany(Employer, {
  foreignKey: "type_id",
  as: "employers",
});

Employer.belongsTo(EmployerType, {
  foreignKey: "type_id",
  as: "type",
});
