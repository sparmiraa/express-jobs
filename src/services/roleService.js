import { Role } from "../models/Role.js";

class RoleService {
  async getByName(name, transaction) {
    return Role.findOne({where: {name}, transaction});
  }
}

export default new RoleService()