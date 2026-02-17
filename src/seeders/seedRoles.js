import { Role } from "../models/Role.js";

export async function seedRoles() {
  const roles = ["ADMIN", "EMPLOYER", "CANDIDATE"];

  for (const name of roles) {
    await Role.findOrCreate({ where: { name } });
  }
}
