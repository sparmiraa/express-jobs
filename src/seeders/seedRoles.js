import { Role } from "../models/Role.js";
import RolesName from "../constants/roles.js";

export async function seedRoles() {
  for (const name of Object.values(RolesName)) {
    await Role.findOrCreate({ where: { name } });
  }
}
