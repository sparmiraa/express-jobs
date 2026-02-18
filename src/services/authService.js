import { sequalize } from "../config/sequalize.js";
import RolesName from "../constants/roles.js";
import ApiError from "../exceptions/apiError.js";
import candidateService from "./candidateService.js";
import employerService from "./employerService.js";
import roleService from "./roleService.js";
import tokenService from "./tokenService.js";
import userService from "./userService.js";
import { Role } from "../models/Role.js";

class AuthService {
  async registerCandidate(data) {
    return sequalize.transaction(async (t) => {
      const exists = await userService.findByEmail(data.email, t);
      if (exists)
        throw ApiError.BadRequest(
          "Пользователь с такой электронной почтой уже существует"
        );

      const role = await roleService.getByName(RolesName.CANDIDATE, t);

      const user = await userService.createUser(
        {
          ...data,
          role_id: role.id,
        },
        t
      );

      await candidateService.createEmpty(user.id, t);

      const accessToken = tokenService.generateAccessToken({
        userId: user.id,
        role: role.name,
      });

      const refreshToken = tokenService.generateRefreshToken({
        userId: user.id,
      });

      return {
        accessToken,
        refreshToken,
      };
    });
  }

  async registerEmployer(data) {
    return sequalize.transaction(async (t) => {
      const exists = await userService.findByEmail(data.email, t);
      if (exists)
        throw ApiError.BadRequest(
          "Пользователь с такой электронной почтой уже существует"
        );

      const role = await roleService.getByName(RolesName.EMPLOYER, t);

      const user = await userService.createUser(
        {
          ...data,
          role_id: role.id,
        },
        t
      );

      await employerService.createEmpty(user.id, t);

      const accessToken = tokenService.generateAccessToken({
        userId: user.id,
        role: role.name,
      });

      const refreshToken = tokenService.generateRefreshToken({
        userId: user.id,
      });

      return {
        accessToken,
        refreshToken,
      };
    });
  }

  async refresh(refreshToken) {
    const tokenData = tokenService.verifyRefreshToken(refreshToken);
    if (tokenData) {
      throw ApiError.Unauthorized();
    }

    const user = await userService.findById(tokenData.userId);
    const role = await Role.findByPk(user.role_id);

    const newAccessToken = tokenService.generateAccessToken({
      userId: user.id,
      role: role.name,
    });

    const newRefreshToken = tokenService.generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getMe(payload) {
    const user = await userService.findById(tokenData.userId);
    const role = await Role.findByPk(user.role_id);

    return {
      id: user.id,
      name: user.name,
      role: role.name,
    };
  }
}

export default new AuthService()