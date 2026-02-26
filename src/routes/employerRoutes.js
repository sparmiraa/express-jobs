import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import {validateMiddleware} from "../middlewares/validateMiddleware.js";
import employerController from "../controllers/employerController.js";

import { updateEmployerBioSchema } from "../schemas/employerSchemas/updateBioSchema.js";
import { updateEmployerInfoSchema } from "../schemas/employerSchemas/updateInfoSchema.js";

const router = new Router();

router.get(
  "",
  AuthMiddleware,
  employerController.getCurrent
);
router.patch(
  "/info",
  AuthMiddleware,
  validateMiddleware(updateEmployerInfoSchema),
  employerController.updateInfo
);
router.patch(
  "/bio",
  AuthMiddleware,
  validateMiddleware(updateEmployerBioSchema),
  employerController.updateBio
);

export default router;
