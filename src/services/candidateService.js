import ApiError from "../exceptions/apiError.js";
import {Candidate} from "../models/Candidate.js";
import {User} from "../models/User.js";
import {CandidateSkill} from "../models/CandidateSkill.js";
import {sequalize} from "../config/sequalize.js";
import candidateExperienceService from "./candidateExperienceService.js";
import userService from "./userService.js";

class CandidateService {
  async createEmpty(userId, transaction) {
    return Candidate.create({user_id: userId}, {transaction});
  }

  async getCurrentByUserId(userId) {
    const user = await userService.findById(userId)
    const candidateInstance = await this.getByUserId(userId);
    const currentCandidate = candidateInstance.get({plain: true});
    const candidateExperience = await candidateExperienceService.getByCandidateId(currentCandidate.id);

    const skillsRows = await CandidateSkill.findAll({
      where: {candidate_id: currentCandidate.id},
      attributes: ["skill_id"],
      raw: true,
    });

    const skillsId = skillsRows.map(r => r.skill_id);

    const experience =
      candidateExperience.map(e => {
        return {
          id: e.id,
          candidateId: e.candidate_id,
          companyName: e.company_name,
          title: e.job_title,
          bio: e.bio,
          startFrom: e.date_start,
          endTo: e.date_end,
        };
      })

    return {
      name: user.name, phoneNumber: user.phone_number,
      email: user.email, ...currentCandidate, experience, skillsId
    };
  }

  async getByUserId(userId) {
    const candidate = await Candidate.findOne({
      where: {user_id: userId, is_deleted: false},
    });

    if (!candidate) {
      throw ApiError.NotFound("Кандидат не найден");
    }

    return candidate;
  }

  async updateInfo(userId, data) {
    await sequalize.transaction(async (transaction) => {
      const candidate = await this.getByUserId(userId);

      await User.update(
        {
          name: data.name,
          phone_number: data.phoneNumber,
        },
        {where: {id: userId}, transaction}
      );

      await candidate.update(
        {
          birthday: data.birthday,
          city_id: data.cityId,
        },
        {transaction}
      );
    });
  }

  async updateBio(userId, data) {
    await sequalize.transaction(async (transaction) => {
      const candidate = await this.getByUserId(userId);

      await candidate.update({
        bio: data.bio,
        salary_from: data.salaryFrom,
        salary_to: data.salaryTo,
      }, {transaction});

      if (data.skillsId) {
        await CandidateSkill.destroy({
          where: {candidate_id: candidate.id},
        }, {transaction});

        await CandidateSkill.bulkCreate(
          data.skillsId.map((skillId) => ({
            candidate_id: candidate.id,
            skill_id: skillId,
          })), {transaction});
      }
    })
  }

  async updateActiveStatus(userId, isActive) {
    const candidate = await this.getByUserId(userId);
    await candidate.update({is_active: isActive});
    return candidate;
  }
}

export default new CandidateService();
