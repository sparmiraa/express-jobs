import * as yup from "yup";

const skillIdsSchema = yup
  .array()
  .of(
    yup
      .number()
      .integer("skillId должен быть целым числом")
      .positive()
      .required()
  )
  .min(1, "Укажите хотя бы 1 навык")
  .required("skillIds обязателен");

export const createVacancySchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(2, "Название слишком короткое")
    .max(255)
    .required("Укажите название вакансии"),

  cityId: yup.number().integer().positive().required("Укажите город"),

  salaryFrom: yup.number().nullable().min(0).optional(),

  salaryTo: yup
    .number()
    .nullable()
    .min(yup.ref("salaryFrom"), "salaryTo не может быть меньше salaryFrom")
    .optional(),

  requiredText: yup.string().max(1000).nullable().optional(),
  plusText: yup.string().max(1000).nullable().optional(),
  responsibilities: yup.string().max(1000).nullable().optional(),
  assumptions: yup.string().max(1000).nullable().optional(),

  skillIds: skillIdsSchema,
});

export const updateVacancySchema = createVacancySchema;