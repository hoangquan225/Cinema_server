import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';
import { userRouter } from '../api/user';

const router = Router();

router.use(authRouter);
router.use(filmRouter);
router.use(userRouter);

export { router as webRouters };
