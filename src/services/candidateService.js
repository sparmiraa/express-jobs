import ApiError from "../exceptions/apiError.js";
import { Candidate } from "../models/Candidate.js";
import { User } from "../models/User.js";
import { CandidateSkill } from "../models/CandidateSkill.js";
import { sequalize } from "../config/sequalize.js";

class CandidateService {
  async createEmpty(userId, transaction) {
    return Candidate.create({ user_id: userId }, { transaction });
  }

  async getByUserId(userId) {
    const candidate = await Candidate.findOne({
      where: { user_id: userId, is_deleted: false },
    });

    if (!candidate) {
      throw ApiError.NotFound("Кандидат не найден");
    }

    return candidate;
  }

  async updateInfo(userId, data) {
    return sequalize.transaction(async (transaction) => {
      const candidate = await this.getByUserId(userId);

      await User.update(
        {
          name: data.name,
          phone_number: data.phoneNumber,
        },
        { where: { id: userId }, transaction }
      );

      await candidate.update(
        {
          birthday: data.birthDate,
          city_id: data.cityId,
        },
        { transaction }
      );

      return candidate;
    });
  }

  async updateBio(userId, data) {
    const candidate = await this.getByUserId(userId);

    await candidate.update({
      bio: data.bio,
      salary_from: data.salaryFrom,
      salary_to: data.salaryTo,
    });

    if (data.skillsId) {
      await CandidateSkill.destroy({
        where: { candidate_id: candidate.id },
      });

      await CandidateSkill.bulkCreate(
        data.skillsId.map((skillId) => ({
          candidate_id: candidate.id,
          skill_id: skillId,
        }))
      );
    }

    return candidate;
  }

  async updateActiveStatus(userId, isActive) {
    const candidate = await this.getByUserId(userId);

    await candidate.update({
      is_active: isActive,
    });

    return candidate;
  }
}

export default new CandidateService();
