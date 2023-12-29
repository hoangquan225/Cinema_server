import  { Router } from "express";
import { filmMobileRouter } from "./film";
import asyncHandler from '../../utils/asyncHandler';
import { authRouter } from "./auth";

const router = Router()
router.use(filmMobileRouter);
router.use(authRouter);

// router.get("/", asyncHandler(async (req, res) => {
//     return res.json('heelo')
// }))

export { router as RouterMobile };