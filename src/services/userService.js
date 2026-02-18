import { name } from "ejs";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

class UserService {
  async findByEmail(email, transaction) {
    return User.findOne({ where: { email }, transaction });
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async createUser(data, transaction) {
    const hashed = await bcrypt.hash(data.password, 10);

    return User.create(
      {
        email: data.email,
        password: hashed,
        name: data.name,
        role_id: data.role_id,
      },
      { transaction }
    );
  }
}

export default new UserService()
