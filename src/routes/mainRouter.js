import {Router} from "express";
import mainController from "../controllers/mainController.js";

const router = new Router();

router.get('/skills', mainController.getSkills);
router.get('/cities', mainController.getCities);
router.get('/employer-type', mainController.getEmployerTypes);

export default router;
