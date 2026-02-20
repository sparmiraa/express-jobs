import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import candidateController from "../controllers/candidateController.js";

const router = new Router();

router.patch("/info", AuthMiddleware, candidateController.updateInfo);
router.patch("/bio", AuthMiddleware, candidateController.updateBio);
router.patch("/active", AuthMiddleware, candidateController.updateActiveStatus);

router.post(
  "/experience",
  AuthMiddleware,
  candidateController.createExperience,
);

router.put("/experience", AuthMiddleware, candidateController.updateExperience);
router.delete(
  "/experience/:id",
  AuthMiddleware,
  candidateController.deleteExperience,
);

export default router;
