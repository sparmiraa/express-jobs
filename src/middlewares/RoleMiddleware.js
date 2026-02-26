import ApiError from "../exceptions/apiError.js";

export default function RoleMiddleware(roleNames) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.Unauthorized());
      }

      if (!roleNames.includes(req.user.role)) {
        return next(ApiError.Forbidden("Недостаточно прав"));
      }

      next();
    } catch (e) {
      next(e);
    }
  };
}