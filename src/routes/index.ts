import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';

const router = Router();

router.use(authRouter);
router.use(filmRouter);

export { router as webRouters };
