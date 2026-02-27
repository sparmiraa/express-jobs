import ApiError from "../exceptions/apiError.js";
import { Employer } from "../models/Employer.js";
import { EmployerType } from "../models/EmployerType.js";
import { User } from "../models/User.js";
import { Vacancy } from "../models/Vacancy.js";
import { sequalize } from "../config/sequalize.js";
import userService from "./userService.js";
import { Op, fn, col } from "sequelize";
import { City } from "../models/City.js";

class EmployerService {
  async createEmpty(userId, transaction) {
    return Employer.create({ user_id: userId }, { transaction });
  }

  async getCurrentByUserId(userId) {
    const user = await userService.findById(userId);
    const employerInstance = await this.getByUserId(userId);
    const currentEmployer = employerInstance.get({ plain: true });

    return {
      name: user.name,
      phoneNumber: user.phone_number,
      email: user.email,
      ...currentEmployer,
    };
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
          type_id: data.typeId,
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
      shortBio: data.shortBio,
      employees_count: data.employeesCount,
    });

    return employer;
  }

  async search(query) {
    const queryName = (query.name ?? "").trim();

    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Math.min(
      Number(query.limit) > 0 ? Number(query.limit) : 12,
      50,
    );
    const offset = (page - 1) * limit;

    const userWhere = {};

    if (queryName) {
      userWhere.name = {
        [Op.like]: `%${queryName}%`,
      };
    }

    const SORT_FIELDS = {
      name: [{ model: User, as: "user" }, "name"],
      type: [{ model: EmployerType, as: "type" }, "name"],
      vacancies: [fn("COUNT", col("vacancies.id"))],
      id: ["id"],
    };

    const sort = query.sort ?? "name";
    const sortOrder = query.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const orderField = SORT_FIELDS[sort] ?? SORT_FIELDS.name;

    const { rows, count } = await Employer.findAndCountAll({
      where: {
        is_deleted: false,
      },

      attributes: [
        "id",
        "shortBio",
        [fn("COUNT", col("vacancies.id")), "vacanciesCount"],
      ],

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
        {
          model: Vacancy,
          as: "vacancies",
          attributes: [],
          where: {
            is_deleted: false,
            is_active: true,
          },
          required: false,
        },
      ],

      group: ["Employer.id", "user.id", "type.id"],

      order: [[...orderField, sortOrder]],

      limit,
      offset,
      distinct: true,
      subQuery: false,
    });

    return {
      total: Array.isArray(count) ? count.length : count,
      page,
      limit,
      data: rows.map((row) => ({
        id: row.id,
        name: row.user.name,
        shortBio: row.shortBio,
        type: row.type,
        vacanciesCount: Number(row.get("vacanciesCount")),
      })),
    };
  }

  async getPublicById(employerId) {
  const id = Number(employerId);
  if (!Number.isFinite(id) || id <= 0) throw ApiError.BadRequest("Некорректный id компании");

  const employer = await Employer.findOne({
    where: { id, is_deleted: false },
    attributes: ["id", "shortBio", "bio", "city_id", "type_id", "employees_count"],
    include: [
      { model: User, as: "user", attributes: ["id", "name"], required: true },
      { model: EmployerType, as: "type", attributes: ["id", "name"], required: false },
      { model: City, attributes: ["id", "name"], required: false },
      {
        model: Vacancy,
        as: "vacancies",
        attributes: [],
        where: { is_deleted: false, is_active: true },
        required: false,
      },
    ],
    group: ["Employer.id", "user.id", "type.id", "City.id"],
  });

  if (!employer) throw ApiError.NotFound("Компания не найдена");

  // ⚠️ т.к. group + vacancies attributes: [] — count не прилетит сам,
  // проще посчитать отдельно:
  const vacanciesCount = await Vacancy.count({
    where: { employer_id: id, is_deleted: false, is_active: true },
  });

  return {
    id: employer.id,
    name: employer.user.name,
    shortBio: employer.shortBio ?? null,
    bio: employer.bio ?? null,
    cityId: employer.city_id ?? null,
    cityName: employer.City?.name ?? null,
    employeesCount: employer.employees_count ?? null,
    type: employer.type ?? null,
    vacanciesCount,
  };
}
}

export default new EmployerService();
