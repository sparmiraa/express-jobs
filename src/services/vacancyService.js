import {Vacancy} from "../models/Vacancy.js";
import {Employer} from "../models/Employer.js";
import {Skill} from "../models/Skill.js";
import {VacancySkill} from "../models/VacancySkill.js";
import {sequalize} from "../config/sequalize.js";
import ApiError from "../exceptions/apiError.js";

class VacancyService {

  async getById(vacancyId) {
    const vacancy = await Vacancy.findOne({
      where: {id: vacancyId},
      include: [
        {
          model: Skill,
          attributes: ["id"],
          through: {attributes: []},
        },
      ],
    });

    if (!vacancy) throw ApiError.NotFound("Вакансия не найдена");

    const plain = vacancy.get({plain: true});

    return {
      ...plain,
      skills: plain.Skills?.map((s) => s.id) ?? [],
      Skills: undefined
    };
  }

  async create(userId, createDto) {
    const t = await sequalize.transaction();
    try {
      const employer = await Employer.findOne({
        where: {user_id: userId, is_deleted: false},
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
          is_active: false,
        },
        {transaction: t}
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
        where: {user_id: userId, is_deleted: false},
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
        {transaction: t}
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
        where: {user_id: userId, is_deleted: false},
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
      await vacancy.save({transaction: t});

      await t.commit();
      return vacancy;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  async _replaceVacancySkills(vacancyId, skillIds, transaction) {
    const uniqueSkillIds = [...new Set(skillIds)];

    await VacancySkill.destroy({
      where: {vacancy_id: vacancyId},
      transaction,
    });

    if (uniqueSkillIds.length > 0) {
      await VacancySkill.bulkCreate(
        uniqueSkillIds.map((skillId) => ({
          vacancy_id: vacancyId,
          skill_id: skillId,
        })),
        {transaction}
      );
    }
  }

  async _assertSkillsExist(skillIds, transaction) {
    const uniqueSkillIds = [...new Set(skillIds)];
    const count = await Skill.count({
      where: {id: uniqueSkillIds},
      transaction,
    });

    if (count !== uniqueSkillIds.length) {
      throw ApiError.BadRequest("Некорректные навыки");
    }
  }
}

export default new VacancyService();