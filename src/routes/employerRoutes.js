import { Router } from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import employerController from "../controllers/employerController.js";

const router = new Router();

router.post("/employer/info", AuthMiddleware, employerController.updateInfo);
router.post("/employer/bio", AuthMiddleware, employerController.updateBio);

export default router;
