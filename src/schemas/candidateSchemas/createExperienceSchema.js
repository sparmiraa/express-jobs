import * as yup from "yup";

export const createExperienceSchema = yup.object({
  companyName: yup
    .string()
    .trim()
    .min(2, "Название компании слишком короткое")
    .max(32, "Название компании слишком длинное")
    .required("Укажите название компании"),

  title: yup
    .string()
    .trim()
    .min(2, "Укажите должность")
    .max(255)
    .required("Укажите должность"),

  bio: yup.string().max(2000, "Описание слишком длинное").optional(),

  startFrom: yup
    .date()
    .typeError("Укажите корректную дату начала")
    .required("Укажите дату начала"),

  endTo: yup
    .date()
    .nullable()
    .min(
      yup.ref("startFrom"),
      "Дата окончания не может быть раньше даты начала"
    )
    .optional(),
});
