import ApiError from "../exceptions/apiError.js";
import { Employer } from "../models/Employer.js";
import { User } from "../models/User.js";
import { sequalize } from "../config/sequalize.js";

class EmployerService {
  async createEmpty(userId, transaction) {
    return Employer.create({ user_id: userId }, { transaction });
  }

  async getByUserId(userId) {
    const employer = await Employer.findOne({
      where: { user_id: userId, is_deleted: false },
    });

    if (!employer) {
      throw ApiError.NotFound("Работодатель не найден");
    }

    return employer;
  }

  async updateInfo(userId, data) {
    return sequalize.transaction(async (transaction) => {
      const employer = await this.getByUserId(userId);

      await User.update(
        { name: data.name },
        { where: { id: userId }, transaction }
      );

      await employer.update(
        {
          city_id: data.cityId,
          type_id: data.employerTypeId,
        },
        { transaction }
      );

      return employer;
    });
  }

  async updateBio(userId, data) {
    const employer = await this.getByUserId(userId);

    await employer.update({
      bio: data.bio,
      employees_count: data.employeesCount,
    });

    return employer;
  }
}

export default new EmployerService();
