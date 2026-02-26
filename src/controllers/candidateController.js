import candidateExperienceService from "../services/candidateExperienceService.js";
import candidateService from "../services/candidateService.js";

class CandidateController {
  async getCurrent(req, res, next) {
    try {
      const result = await candidateService.getCurrentByUserId(req.user.userId)
      res.json(result)
    } catch (e) {
      next(e);
    }
  }

  async updateInfo(req, res, next) {
    try {
      const result = await candidateService.updateInfo(
        req.user.userId,
        req.body
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateBio(req, res, next) {
    try {
      const result = await candidateService.updateBio(
        req.user.userId,
        req.body
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async createExperience(req, res, next) {
    try {
      const exp = await candidateExperienceService.create(
        req.user.userId,
        req.body
      );
      res.json(exp);
    } catch (e) {
      next(e);
    }
  }

  async updateExperience(req, res, next) {
    try {
      const exp = await candidateExperienceService.update(
        req.user.userId,
        req.params.id,
        req.body
      );
      res.json(exp);
    } catch (e) {
      next(e);
    }
  }

  async deleteExperience(req, res, next) {
    try {
      await candidateExperienceService.delete(req.user.userId, req.params.id);
      res.json({success: true});
    } catch (e) {
      next(e);
    }
  }

  async updateActiveStatus(req, res, next) {
    try {
      const {isActive} = req.body;
      const candidate = await candidateService.updateActiveStatus(
        req.user.userId,
        isActive
      );
      res.json(candidate);
    } catch (e) {
      next(e);
    }
  }
}

export default new CandidateController();
