import employerService from "../services/employerService.js";

class EmployerController {
  async updateInfo(req, res, next) {
    try {
      const result = await employerService.updateInfo(req.user.id, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async updateBio(req, res, next) {
    try {
      const result = await employerService.updateBio(req.user.id, req.body);
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
}

export default new EmployerController();
