import * as yup from "yup";

export const updateEmployerInfoSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(32, "Максимум 32 символа")
    .required(),

  cityId: yup.number().integer().positive().required(),

  employerTypeId: yup.number().integer().positive().required(),
});
