import ApiError from "../exceptions/apiError.js";

export const validateMiddleware = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (e) {
      const errors = e.inner
        ? e.inner.map((e) => ({ field: e.path, message: e.message }))
        : [];
      next(ApiError.BadRequest("Ошибка валидации", errors));
    }
  };
};
