import candidateService from "./candidateService.js";
import {CandidateExperience} from "../models/CandidateExperience.js";
import ApiError from "../exceptions/apiError.js";

class CandidateExperienceService {

  async getByCandidateId(candidateId) {
    return await CandidateExperience.findAll({
      where:
        {candidate_id: candidateId}, raw: true,
      order: [["date_start", "DESC"]]
    });
  }

  async create(userId, data) {
    const candidate = await candidateService.getByUserId(userId);

    const experience = await CandidateExperience.create({
      candidate_id: candidate.id,
      company_name: data.companyName,
      job_title: data.title,
      bio: data.bio,
      date_start: data.startFrom,
      date_end: data.endTo,
    });

    return {
      id: experience.id,
      candidateId: experience.candidate_id,
      companyName: experience.company_name,
      title: experience.job_title,
      bio: experience.bio,
      startFrom: experience.date_start,
      endTo: experience.date_end,
    }
  }

  async update(userId, experienceId, data) {
    const candidate = await candidateService.getByUserId(userId);

    const experience = await CandidateExperience.findByPk(experienceId);
    if (!experience) throw ApiError.NotFound("Опыт не найден");
    if (experience.candidate_id !== candidate.id) throw ApiError.Forbidden();

    await experience.update({
      company_name: data.companyName,
      job_title: data.title,
      bio: data.bio,
      date_start: data.startFrom,
      date_end: data.endTo,
    });

    return experience;
  }

  async delete(userId, experienceId) {
    const candidate = await candidateService.getByUserId(userId);

    const experience = await CandidateExperience.findByPk(experienceId);
    if (!experience) throw ApiError.NotFound("Опыт не найден");
    if (experience.candidate_id !== candidate.id) throw ApiError.Forbidden();

    await experience.destroy();
  }
}

export default new CandidateExperienceService();
