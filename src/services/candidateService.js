
import ApiError from "../exceptions/apiError.js";
import { Candidate } from "../models/Candidate.js";
import { User } from "../models/User.js";
import { CandidateSkill } from "../models/CandidateSkill.js";

class CandidateService {
  async createEmpty(userId, transaction) {
    return Candidate.create(
      {
        user_id: userId,
      },
      { transaction },
    );
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
    const candidate = await this.getByUserId(userId);

    const { name, phoneNumber, birthDate, cityId } = data;

    const userUpdateData = {};

    if (name !== undefined) {
      userUpdateData.name = name;
    }

    if (phoneNumber !== undefined) {
      userUpdateData.phone_number = phoneNumber;
    }

    if (Object.keys(userUpdateData).length > 0) {
      await User.update(userUpdateData, {
        where: { id: userId },
      });
    }

    const candidateUpdateData = {};

    if (birthDate !== undefined) {
      candidateUpdateData.birthday = birthDate;
    }

    if (cityId !== undefined) {
      candidateUpdateData.city_id = cityId;
    }

    if (Object.keys(candidateUpdateData).length > 0) {
      await candidate.update(candidateUpdateData);
    }

    return candidate;
  }

  async updateBio(userId, data) {
    const candidate = await this.getByUserId(userId);

    const { bio, skillsId, salaryFrom, salaryTo } = data;

    const updateData = {};

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (salaryFrom !== undefined) {
      updateData.salary_from = salaryFrom;
    }

    if (salaryTo !== undefined) {
      updateData.salary_to = salaryTo;
    }

    if (Object.keys(updateData).length > 0) {
      await candidate.update(updateData);
    }

    if (Array.isArray(skillsId)) {
      await CandidateSkill.destroy({
        where: { candidate_id: candidate.id },
      });

      if (skillsId.length > 0) {
        const bulk = skillsId.map((skillsId) => ({
          candidate_id: candidate.id,
          skill_id: skillsId,
        }));

        await CandidateSkill.bulkCreate(bulk);
      }
    }
    return candidate;
  }

  async updateActiveStatus(userId, isActive) {
    if (typeof isActive !== "boolean") {
      throw ApiError.BadRequest("Должен быть boolean");
    }

    const candidate = await this.getByUserId(userId);

    await candidate.update({
      is_active: isActive,
    });

    return candidate;
  }
}

export default new CandidateService();
