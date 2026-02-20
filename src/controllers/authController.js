import { env } from "../config/env.config.js";
import ApiError from "../exceptions/apiError.js";
import authService from "../services/authService.js";
import userService from "../services/userService.js";

class AuthController {
  async registerCandidate(req, res, next) {
    try {
      const { email, name, password } = req.body;

      const tokens = await authService.registerCandidate({
        email,
        name,
        password,
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: env.TIME_TO_LIVE_REFRESH_TOKEN,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async registerEmployer(req, res, next) {
    try {
      const { email, name, password } = req.body;

      const tokens = await authService.registerEmployer({
        email,
        name,
        password,
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: env.TIME_TO_LIVE_REFRESH_TOKEN,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.Unauthorized();
      }

      const tokens = await authService.refresh(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: env.TIME_TO_LIVE_REFRESH_TOKEN,
      });

      return res.json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const tokens = await authService.login({ email, password });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: env.TIME_TO_LIVE_REFRESH_TOKEN,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie("refreshToken");
      return res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  async getMe(req, res, next) {
    try {
      const data = await authService.getMe(req.user);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      res.status(200).json({ message: "Письмо отправлено" });
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { requestId } = req.query;
      const { newPassword } = req.body;

      await authService.resetPassword(requestId, newPassword);

      res.status(200).json({ message: "Пароль успешно обновлен" });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
