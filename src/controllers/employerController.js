import employerService from "../services/employerService.js";

class EmployerController {
  async getCurrent(req, res, next) {
    try {
      const result = await employerService.getCurrentByUserId(req.user.userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateInfo(req, res, next) {
    try {
      const result = await employerService.updateInfo(
        req.user.userId,
        req.body,
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateBio(req, res, next) {
    try {
      const result = await employerService.updateBio(req.user.userId, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async search(req, res, next) {
    try {
      const result = await employerService.search(req.query);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getPublicById(req, res, next) {
    try {
      const result = await employerService.getPublicById(req.params.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new EmployerController();
