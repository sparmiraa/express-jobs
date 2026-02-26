import * as yup from "yup";

export const updateCandidateInfoSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(32, "Максимум 32 символа")
    .required(),

  phoneNumber: yup.string().matches(/^\+?[0-9]{10,15}$/, "Некорректный номер")
    .required(),

  birthday: yup.date().typeError("Некорректная дата").required(),

  cityId: yup.number().required(),
});
