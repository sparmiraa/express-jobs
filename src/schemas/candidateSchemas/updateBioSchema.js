import * as yup from "yup";

export const updateCandidateBioSchema = yup.object({
  bio: yup.string().max(2000, "Максимум 2000 символов").required(),

  salaryFrom: yup.number().integer().min(0).required(),

  salaryTo: yup
    .number()
    .integer()
    .min(
      yup.ref("salaryFrom"),
      "Максимальная зарплата должна быть больше минимальной"
    )
    .required(),

  skillsId: yup.array().of(yup.number().integer().positive()).required(),
});
