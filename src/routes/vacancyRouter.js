import {Router} from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import RoleMiddleware from "../middlewares/roleMiddleware.js";
import {validateMiddleware} from "../middlewares/validateMiddleware.js";
import RolesName from "../constants/roles.js";
import vacancyController from "../controllers/VacancyController.js";
import {
  createVacancySchema,
  updateVacancySchema,
} from "../schemas/vacancySchemas/vacancySchema.js";

const router = new Router();

// TODO: add view/:id fpr candidate
router.get(
  "/:id/edit",
  AuthMiddleware,
  RoleMiddleware(RolesName.EMPLOYER),
  vacancyController.getById
);

router.post(
  "",
  AuthMiddleware,
  RoleMiddleware(RolesName.EMPLOYER),
  validateMiddleware(createVacancySchema),
  vacancyController.create
);

router.put(
  "/:id",
  AuthMiddleware,
  RoleMiddleware(RolesName.EMPLOYER),
  validateMiddleware(updateVacancySchema),
  vacancyController.update
);

router.patch(
  "/:id/status",
  AuthMiddleware,
  RoleMiddleware(RolesName.EMPLOYER),
  vacancyController.changeStatus
);

export default router;