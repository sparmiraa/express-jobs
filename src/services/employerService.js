import ApiError from "../exceptions/apiError.js";
import { Employer } from "../models/Employer.js";
import { EmployerType } from "../models/EmployerType.js";
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
        { where: { id: userId }, transaction },
      );

      await employer.update(
        {
          city_id: data.cityId,
          type_id: data.employerTypeId,
        },
        { transaction },
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

  async search(query) {
    const queryName = (query.name ?? "").trim();

    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 12;
    const offset = (page - 1) * limit;

    const userWhere = {};

    if (queryName) {
      userWhere.name = {
        [Op.like]: `%${queryName}%`,
      };
    }

    const { rows, count } = await Employer.findAndCountAll({
      where: {
        is_deleted: false,
      },

      attributes: ["id", "shortBio"],

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
          where: userWhere,
          required: true,
        },
        {
          model: EmployerType,
          as: "type",
          attributes: ["id", "name"],
        },
      ],

      order: [[{ model: User, as: "user" }, "name", "ASC"]],

      limit,
      offset,

      distinct: true,
    });

    return {
      total: count,
      page,
      limit,
      data: rows.map((row) => ({
        id: row.id,
        name: row.user.name,
        shortBio: row.shortBio,
        type: row.type,
      })),
    };
  }
}

export default new EmployerService();
