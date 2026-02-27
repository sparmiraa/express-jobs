import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import { validateMiddleware } from "../middlewares/validateMiddleware.js";
import employerController from "../controllers/employerController.js";

import { updateEmployerBioSchema } from "../schemas/employerSchemas/updateBioSchema.js";
import { updateEmployerInfoSchema } from "../schemas/employerSchemas/updateInfoSchema.js";
import RoleMiddleware from "../middlewares/roleMiddleware.js";
import RolesName from "../constants/roles.js";

const router = new Router();

router.get("", AuthMiddleware, employerController.getCurrent);
router.patch(
  "/info",
  AuthMiddleware,
  validateMiddleware(updateEmployerInfoSchema),
  employerController.updateInfo,
);
router.patch(
  "/bio",
  AuthMiddleware,
  validateMiddleware(updateEmployerBioSchema),
  employerController.updateBio,
);

router.get("/search", AuthMiddleware, employerController.search);

router.get(
  "/:id",
  AuthMiddleware,
  RoleMiddleware(RolesName.CANDIDATE),
  employerController.getPublicById,
);

export default router;
