import * as yup from "yup";

export const updateActiveStatusSchema = yup.object({
  isActive: yup.boolean(),
});
