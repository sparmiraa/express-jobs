import * as yup from "yup";

export const updateExperienceSchema = yup.object({
  companyName: yup
    .string()
    .trim()
    .min(2, "Название компании слишком короткое")
    .max(32, "Название компании слишком длинное")
    .required(),

  title: yup.string().trim().min(2, "Укажите должность").max(255).required(),

  bio: yup.string().max(2000).required(),

  startFrom: yup.date().typeError("Некорректная дата начала").required(),

  endTo: yup
    .date()
    .nullable()
    .min(
      yup.ref("startFrom"),
      "Дата окончания не может быть раньше даты начала"
    )
    .required(),
});
