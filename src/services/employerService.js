import { Employer } from "../models/employer.model.js";

class EmployerService {
  async createEmpty(userId, transaction) {
    return Employer.create(
      {
        user_id: userId,
      },
      { transaction }
    );
  }
}

export default new EmployerService();
