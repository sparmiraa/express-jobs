import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import {validateMiddleware} from "../middlewares/validateMiddleware.js";

import candidateController from "../controllers/candidateController.js";

import { createExperienceSchema } from "../schemas/candidateSchemas/createExperienceSchema.js";
import { updateExperienceSchema } from "../schemas/candidateSchemas/updateExperienceSchema.js";
import { updateActiveStatusSchema } from "../schemas/candidateSchemas/updateActiveStatusSchema.js";
import { updateCandidateInfoSchema } from "../schemas/candidateSchemas/updateInfoSchema.js";
import { updateCandidateBioSchema } from "../schemas/candidateSchemas/updateBioSchema.js";

const router = new Router();

router.patch(
  "/info",
  AuthMiddleware,
  validateMiddleware(updateCandidateInfoSchema),
  candidateController.updateInfo
);
router.patch(
  "/bio",
  AuthMiddleware,
  validateMiddleware(updateCandidateBioSchema),
  candidateController.updateBio
);
router.patch(
  "/active",
  AuthMiddleware,
  validateMiddleware(updateActiveStatusSchema),
  candidateController.updateActiveStatus
);

router.post(
  "/experience",
  AuthMiddleware,
  validateMiddleware(createExperienceSchema),
  candidateController.createExperience
);

router.put(
  "/experience/:id",
  AuthMiddleware,
  validateMiddleware(updateExperienceSchema),
  candidateController.updateExperience
);

router.delete(
  "/experience/:id",
  AuthMiddleware,
  candidateController.deleteExperience
);

export default router;
