import {Router} from "express";
import authRouter from "./authRoutes.js";
import candidatesRouter from "./candidateRoutes.js";
import employerRouter from "./employerRoutes.js";
import vacancyRouter from "./vacancyRouter.js";
import mainRouter from "./mainRouter.js";

const router = new Router();

router.use("/auth", authRouter);
router.use("/main", mainRouter);
router.use("/candidates", candidatesRouter);
router.use("/employer", employerRouter);
router.use("/vacancies", vacancyRouter);

export default router;
