import ApiError from "../exceptions/apiError.js";
import HttpStatus from "../constants/httpStatus.js";

export default function (err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res
    .status(HttpStatus.INTERNAL_SERVER)
    .json({ message: "Что-то пошло не так" });
}
