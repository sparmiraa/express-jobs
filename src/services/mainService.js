import {City} from "../models/City.js";
import {Skill} from "../models/Skill.js";
import {EmployerType} from "../models/EmployerType.js";

class MainService {
  async getCities() {
    return await City.findAll({raw: true});
  }

  async getSkills() {
    return await Skill.findAll({raw: true});
  }

  async getEmployerTypes() {
    return await EmployerType.findAll({raw: true});
  }
}

export default new MainService();
