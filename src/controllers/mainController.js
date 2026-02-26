import mainService from "../services/mainService.js";

class MainController {
  async getCities(req, res, next) {
    try {
      const result = await mainService.getCities();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getSkills(req, res, next) {
    try {
      const result = await mainService.getSkills();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getEmployerTypes(req, res, next) {
    try {
      const result = await mainService.getEmployerTypes();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

}

export default new MainController();

