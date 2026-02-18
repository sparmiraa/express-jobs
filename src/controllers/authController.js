import { env } from "../config/env.config.js";
import ApiError from "../exceptions/apiError.js";
import authService from "../services/authService.js";

class AuthController {
  async registerCandidate(req, res, next) {
    try {
      const { email, name, password } = req.body;

      const tokens = authService.registerCandidate({ email, name, password });

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

      const tokens = authService.registerEmployer({ email, name, password });

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
}

export default new AuthController();
