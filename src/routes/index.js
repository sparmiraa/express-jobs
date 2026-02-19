import { Router } from "express";
import authRouter from "./authRoutes.js";

const router = new Router();

router.use("/auth", authRouter);

export default router