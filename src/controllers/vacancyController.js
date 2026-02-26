import vacancyService from "../services/vacancyService.js";

class VacancyController {

  async getAllByEmployerId(req, res, next) {
    try {
      const result = await vacancyService.getAllByEmployerId(req.params.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await vacancyService.getById(req.params.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      const result = await vacancyService.create(req.user.userId, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const result = await vacancyService.update(
        req.user.userId,
        req.params.id,
        req.body
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const result = await vacancyService.changeStatus(
        req.user.userId,
        req.params.id,
        req.body.isActive
      );
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new VacancyController();