import ApiError from "../exceptions/apiError.js";
import { Employer } from "../models/Employer.js";
import { User } from "../models/User.js";

class EmployerService {
  async createEmpty(userId, transaction) {
    return Employer.create(
      {
        user_id: userId,
      },
      { transaction },
    );
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
    const employer = this.getByUserId(userId);

    const { name, cityId, employerTypeId } = data;

    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    const employerUpdateData = {};

    if (cityId !== undefined) {
      employerUpdateData.city_id = cityId;
    }

    if (employerTypeId !== undefined) {
      employerUpdateData.type_id = employerTypeId;
    }

    if (Object.keys(employerUpdateData).length > 0) {
      employer.update(employerUpdateData);
    }

    return employer;
  }

  async updateBio(userId, data) {
    const employer = this.getByUserId(userId);

    const { bio, employeesCount } = data;

    const employerUpdateData = {};

    if (bio !== undefined) {
      employerUpdateData.bio = bio;
    }
    if (employeesCount !== undefined) {
      employerUpdateData.employees_count = employeesCount;
    }

    if (Object.keys(employerUpdateData).length > 0) {
      await employer.update(employerUpdateData);
    }
    return employer;
  }
}

export default new EmployerService();
