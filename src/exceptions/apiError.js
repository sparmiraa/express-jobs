import HttpStatus from "../constants/httpStatus";

export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message, errors = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static Unauthorized(message = "Пользователь не авторизован") {
    return new ApiError(HttpStatus.UNAUTHORIZED, message);
  }
}
