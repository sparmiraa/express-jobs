import * as yup from "yup";

export const updateEmployerBioSchema = yup
  .object({
    bio: yup.string().max(2000, "Максимум 2000 символов").required(),

    employeesCount: yup.number().integer().min(0).required(),
  })
  .noUnknown();
s;
