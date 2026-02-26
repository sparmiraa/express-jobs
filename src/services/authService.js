import { sequalize } from "../config/sequalize.js";
import RolesName from "../constants/roles.js";
import ApiError from "../exceptions/apiError.js";
import candidateService from "./candidateService.js";
import employerService from "./employerService.js";
import roleService from "./roleService.js";
import tokenService from "./tokenService.js";
import userService from "./userService.js";
import { Role } from "../models/Role.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { cache } from "../config/cache.js";
import { sendResetPasswordEmail } from "./emailService.js";

class AuthService {
  async registerCandidate(data) {
    return sequalize.transaction(async (t) => {
      const exists = await userService.findByEmail(data.email, t);
      if (exists)
        throw ApiError.BadRequest(
          "Пользователь с такой электронной почтой уже существует",
        );

      const role = await roleService.getByName(RolesName.CANDIDATE, t);

      const user = await userService.createUser(
        {
          ...data,
          role_id: role.id,
        },
        t,
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
          "Пользователь с такой электронной почтой уже существует",
        );

      const role = await roleService.getByName(RolesName.EMPLOYER, t);

      const user = await userService.createUser(
        {
          ...data,
          role_id: role.id,
        },
        t,
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

  async login(data) {
    const user = await userService.findByEmail(data.email);
    if (!user) {
      throw ApiError.BadRequest("Неверный email или пароль");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw ApiError.BadRequest("Неверный email или пароль");
    }

    const role = await Role.findByPk(user.role_id);

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
  }

  async refresh(refreshToken) {
    const tokenData = tokenService.verifyRefreshToken(refreshToken);
    if (!tokenData) {
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
    const user = await userService.findById(payload.userId);
    if (!user) {
      throw ApiError.Unauthorized();
    }
    const role = await Role.findByPk(user.role_id);

    return {
      id: user.id,
      name: user.name,
      role: role.name,
    };
  }

  async forgotPassword(email) {
    const user = await userService.findByEmail(email);
    if (!user) return;

    const resetId = uuidv4();

    cache.set(`password-reset:${resetId}`, email, 3600);

    const resetLink = `http://localhost:5173/auth/reset-password?requestId=${resetId}`;

    await sendResetPasswordEmail(email, resetLink);
  }

  async resetPassword(requestId, newPassword) {
    const email = cache.get(`password-reset:${requestId}`);

    if (!email) {
      throw ApiError.BadRequest(
        "Ссылка для сброса пароля невалидна или истекла",
      );
    }

    const user = await userService.findByEmail(email);

    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    await userService.updatePassword(user.id, newPassword);

    cache.del(`password-reset:${requestId}`);
  }
}

export default new AuthService();
