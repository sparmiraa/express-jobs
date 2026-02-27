import { Op } from "sequelize";
import { Vacancy } from "../models/Vacancy.js";
import { Employer } from "../models/Employer.js";
import { Skill } from "../models/Skill.js";
import { VacancySkill } from "../models/VacancySkill.js";
import { sequalize } from "../config/sequalize.js";
import ApiError from "../exceptions/apiError.js";
import { City } from "../models/City.js";
import { User } from "../models/User.js";

class VacancyService {
  // =========================
  // EMPLOYER (твои методы)
  // =========================

  async getAllByEmployerId(employerId, query = {}) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Math.min(
      Number(query.limit) > 0 ? Number(query.limit) : 12,
      50,
    );
    const offset = (page - 1) * limit;

    const { rows, count } = await Vacancy.findAndCountAll({
      where: { employer_id: employerId },
      attributes: [
        "id",
        "title",
        "city_id",
        "salary_from",
        "salary_to",
        "is_active",
        "createdAt",
      ],
      include: [
        {
          model: City,
          attributes: ["id", "name"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const items = rows.map((v) => {
      const plain = v.get({ plain: true });
      return {
        id: plain.id,
        title: plain.title,
        cityId: plain.city_id,
        cityName: plain.City?.name ?? null,
        salaryFrom: plain.salary_from,
        salaryTo: plain.salary_to,
        isActive: plain.is_active,
        createdAt: plain.createdAt,
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getById(vacancyId) {
    const vacancy = await Vacancy.findOne({
      where: { id: vacancyId },
      include: [
        {
          model: Skill,
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });

    if (!vacancy) throw ApiError.NotFound("Вакансия не найдена");

    const plain = vacancy.get({ plain: true });

    return {
      ...plain,
      skills: plain.Skills?.map((s) => s.id) ?? [],
      Skills: undefined,
    };
  }

  async create(userId, createDto) {
    const t = await sequalize.transaction();
    try {
      const employer = await Employer.findOne({
        where: { user_id: userId, is_deleted: false },
        transaction: t,
      });
      if (!employer) throw ApiError.NotFound("Работодатель не найден");

      await this._assertSkillsExist(createDto.skillIds, t);

      const vacancy = await Vacancy.create(
        {
          employer_id: employer.id,
          title: createDto.title,
          city_id: createDto.cityId,
          salary_from: createDto.salaryFrom,
          salary_to: createDto.salaryTo,
          required_text: createDto.requiredText,
          plus_text: createDto.plusText,
          responsibilities: createDto.responsibilities,
          assumptions: createDto.assumptions,
        },
        { transaction: t },
      );

      await this._replaceVacancySkills(vacancy.id, createDto.skillIds, t);

      await t.commit();
      return vacancy;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async update(userId, vacancyId, updateDto) {
    const t = await sequalize.transaction();
    try {
      const employer = await Employer.findOne({
        where: { user_id: userId, is_deleted: false },
        transaction: t,
      });
      if (!employer) throw ApiError.NotFound("Работодатель не найден");

      const vacancy = await Vacancy.findOne({
        where: {
          id: vacancyId,
          employer_id: employer.id,
          is_deleted: false,
        },
        transaction: t,
      });
      if (!vacancy) throw ApiError.NotFound("Вакансия не найдена");

      await this._assertSkillsExist(updateDto.skillIds, t);

      await vacancy.update(
        {
          title: updateDto.title,
          city_id: updateDto.cityId,
          salary_from: updateDto.salaryFrom,
          salary_to: updateDto.salaryTo,
          required_text: updateDto.requiredText,
          plus_text: updateDto.plusText,
          responsibilities: updateDto.responsibilities,
          assumptions: updateDto.assumptions,
        },
        { transaction: t },
      );

      await this._replaceVacancySkills(vacancy.id, updateDto.skillIds, t);

      await t.commit();
      return vacancy;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async changeStatus(userId, vacancyId, isActive) {
    const t = await sequalize.transaction();
    try {
      const employer = await Employer.findOne({
        where: { user_id: userId, is_deleted: false },
        transaction: t,
      });
      if (!employer) throw ApiError.NotFound("Работодатель не найден");

      const vacancy = await Vacancy.findOne({
        where: {
          id: vacancyId,
          employer_id: employer.id,
          is_deleted: false,
        },
        transaction: t,
      });
      if (!vacancy) throw ApiError.NotFound("Вакансия не найдена");

      vacancy.is_active = Boolean(isActive);
      await vacancy.save({ transaction: t });

      await t.commit();
      return vacancy;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  // =========================
  // CANDIDATE (новое)
  // =========================

  async getAllPublicByEmployerId(employerId, query = {}) {
    const id = Number(employerId);
    if (!Number.isFinite(id) || id <= 0)
      throw ApiError.BadRequest("Некорректный id компании");

    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Math.min(
      Number(query.limit) > 0 ? Number(query.limit) : 10,
      50,
    );
    const offset = (page - 1) * limit;

    const { rows, count } = await Vacancy.findAndCountAll({
      where: {
        employer_id: id,
        is_active: true,
        is_deleted: false,
      },
      attributes: [
        "id",
        "title",
        "city_id",
        "salary_from",
        "salary_to",
        "createdAt",
      ],
      include: [
        { model: City, attributes: ["id", "name"], required: false },
        {
          model: Skill,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false,
        },
      ],
      distinct: true,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const items = rows.map((v) => {
      const plain = v.get({ plain: true });
      return {
        id: plain.id,
        title: plain.title,
        employerId: id,
        employerName: null, // если нужно — можно подтянуть отдельно
        cityId: plain.city_id,
        cityName: plain.City?.name ?? null,
        salaryFrom: plain.salary_from,
        salaryTo: plain.salary_to,
        createdAt: plain.createdAt,
        skills: (plain.Skills ?? []).map((s) => ({ id: s.id, name: s.name })),
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getAllForCandidate(query = {}) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Math.min(
      Number(query.limit) > 0 ? Number(query.limit) : 12,
      50,
    );
    const offset = (page - 1) * limit;

    const q = (query.q ?? "").trim();
    const cityId = query.cityId ? Number(query.cityId) : null;

    const salaryFrom =
      query.salaryFrom !== undefined &&
      query.salaryFrom !== null &&
      query.salaryFrom !== ""
        ? Number(query.salaryFrom)
        : null;

    const salaryTo =
      query.salaryTo !== undefined &&
      query.salaryTo !== null &&
      query.salaryTo !== ""
        ? Number(query.salaryTo)
        : null;

    const skillIds = this._parseSkillIds(query.skillIds);

    const where = {
      is_active: true,
      is_deleted: false,
    };

    if (q) where.title = { [Op.like]: `%${q}%` };
    if (cityId) where.city_id = cityId;
    if (salaryFrom !== null) where.salary_from = { [Op.gte]: salaryFrom };
    if (salaryTo !== null) where.salary_to = { [Op.lte]: salaryTo };

    // include
    const include = [
      {
        model: City,
        attributes: ["id", "name"],
        required: false,
      },
      {
        model: Employer,
        attributes: ["id", "user_id"],
        required: true,
        where: { is_deleted: false },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
            required: true,
          },
        ],
      },
    ];

    // skills filter
    if (skillIds.length > 0) {
      include.push({
        model: Skill,
        attributes: ["id", "name"],
        through: { attributes: [] },
        required: true,
        where: { id: skillIds },
      });
    } else {
      include.push({
        model: Skill,
        attributes: ["id", "name"],
        through: { attributes: [] },
        required: false,
      });
    }

    const { rows, count } = await Vacancy.findAndCountAll({
      where,
      attributes: [
        "id",
        "title",
        "city_id",
        "salary_from",
        "salary_to",
        "createdAt",
      ],
      include,
      distinct: true, // важно при join skills
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const items = rows.map((v) => {
      const plain = v.get({ plain: true });

      return {
        id: plain.id,
        title: plain.title,

        employerId: plain.Employer?.id ?? null,
        employerName: plain.Employer?.user?.name ?? null, // <-- вот тут

        cityId: plain.city_id,
        cityName: plain.City?.name ?? null,

        salaryFrom: plain.salary_from,
        salaryTo: plain.salary_to,

        createdAt: plain.createdAt,
        skills: (plain.Skills ?? []).map((s) => ({ id: s.id, name: s.name })),
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getPublicById(vacancyId) {
    const vacancy = await Vacancy.findOne({
      where: {
        id: vacancyId,
        is_active: true,
        is_deleted: false,
      },
      attributes: [
        "id",
        "title",
        "city_id",
        "salary_from",
        "salary_to",
        "required_text",
        "plus_text",
        "responsibilities",
        "assumptions",
        "createdAt",
      ],
      include: [
        { model: City, attributes: ["id", "name"], required: false },
        {
          model: Employer,
          attributes: [
            "id",
            "user_id",
            "shortBio",
            "bio",
            "city_id",
            "type_id",
            "employees_count",
          ],
          required: true,
          where: { is_deleted: false },
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name"],
              required: true,
            },
          ],
        },
        {
          model: Skill,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!vacancy) throw ApiError.NotFound("Вакансия не найдена");

    const plain = vacancy.get({ plain: true });

    return {
      id: plain.id,
      title: plain.title,

      employerId: plain.Employer?.id ?? null,
      employerName: plain.Employer?.user?.name ?? null,

      // если хочешь на странице вакансии показывать био/shortBio компании:
      employerShortBio: plain.Employer?.shortBio ?? null,
      employerBio: plain.Employer?.bio ?? null,
      employerEmployeesCount: plain.Employer?.employees_count ?? null,

      cityId: plain.city_id,
      cityName: plain.City?.name ?? null,

      salaryFrom: plain.salary_from,
      salaryTo: plain.salary_to,

      requiredText: plain.required_text,
      plusText: plain.plus_text,
      responsibilities: plain.responsibilities,
      assumptions: plain.assumptions,

      createdAt: plain.createdAt,
      skills: (plain.Skills ?? []).map((s) => ({ id: s.id, name: s.name })),
    };
  }

  // =========================
  // helpers (твои + новые)
  // =========================

  async _replaceVacancySkills(vacancyId, skillIds, transaction) {
    const uniqueSkillIds = [...new Set(skillIds)];

    await VacancySkill.destroy({
      where: { vacancy_id: vacancyId },
      transaction,
    });

    if (uniqueSkillIds.length > 0) {
      await VacancySkill.bulkCreate(
        uniqueSkillIds.map((skillId) => ({
          vacancy_id: vacancyId,
          skill_id: skillId,
        })),
        { transaction },
      );
    }
  }

  async _assertSkillsExist(skillIds, transaction) {
    const uniqueSkillIds = [...new Set(skillIds)];
    const count = await Skill.count({
      where: { id: uniqueSkillIds },
      transaction,
    });

    if (count !== uniqueSkillIds.length) {
      throw ApiError.BadRequest("Некорректные навыки");
    }
  }

  _parseSkillIds(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map(Number).filter((n) => Number.isFinite(n) && n > 0);
    }
    if (typeof raw === "string") {
      return raw
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
    }
    return [];
  }
}

export default new VacancyService();
