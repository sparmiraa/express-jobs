import candidateService from "./candidateService.js";
import { CandidateExperience } from "../models/CandidateExperience.js";
import ApiError from "../exceptions/apiError.js";

class CandidateExperienceService {
  async create(userId, data) {
    const candidate = await candidateService.getByUserId(userId);

    return CandidateExperience.create({
      candidate_id: candidate.id,
      company_name: data.companyName,
      job_title: data.title,
      bio: data.bio,
      date_start: data.startFrom,
      date_end: data.endTo,
    });
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
