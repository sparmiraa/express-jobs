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

  async update(userId, data) {
    const candidate = await candidateService.getByUserId(userId);

    const experience = await CandidateExperience.findByPk(data.id);

    if (!experience) {
      throw ApiError.NotFound("Опыт не найден");
    }

    if (experience.candidate_id !== candidate.id) {
      throw ApiError.Forbidden();
    }

    const updateData = {};

    if (data.companyName !== undefined) {
      updateData.company_name = data.companyName;
    }

    if (data.title !== undefined) {
      updateData.job_title = data.title;
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio;
    }

    if (data.startFrom !== undefined) {
      updateData.date_start = data.startFrom;
    }

    if (data.endTo !== undefined) {
      updateData.date_end = data.endTo;
    }

    if (Object.keys(updateData).length > 0) {
      await experience.update(updateData);
    }

    return experience;
  }

  async delete(userId, experienceId) {
    const candidate = await candidateService.getByUserId(userId);
    const experience = await CandidateExperience.findByPk(experienceId);

    if (!experience) {
      throw ApiError.NotFound("Опыт не найден");
    }

    if (experience.candidate_id !== candidate.id) {
      throw ApiError.Forbidden();
    }

    await experience.destroy();
  }
}

export default new CandidateExperienceService();
