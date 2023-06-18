import { Router } from "express";
import { authRouter } from "../api/auth";

const router = Router();

router.use(authRouter);

export { router as webRouters };
