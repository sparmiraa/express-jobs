import { Router } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware.js";
import { loginSchema, registrationSchema } from "../schemas/authSchemas.js";
import authController from "../controllers/authController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.post(
  "/registration/candidate",
  validateMiddleware(registrationSchema),
  authController.registerCandidate,
);

router.post(
  "/registration/employer",
  validateMiddleware(registrationSchema),
  authController.registerEmployer,
);

router.post("/login", validateMiddleware(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", AuthMiddleware, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/password-reset", authController.resetPassword);

export default router;
