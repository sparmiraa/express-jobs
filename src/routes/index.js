import { Router } from "express";
import authRouter from "./authRoutes.js";
import candidatesRouter from "./candidateRoutes.js";
import employerRouter from "./employerRoutes.js";

const router = new Router();

router.use("/auth", authRouter);
router.use("/candidates", candidatesRouter);
router.use("/employer", employerRouter);

export default router;
