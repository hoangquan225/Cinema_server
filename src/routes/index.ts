import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';
import { userRouter } from '../api/user';
import { ticketRouter } from '../api/ticket';
import { uploadRouter } from '../api/upload';

const router = Router();

router.use(authRouter);
router.use(filmRouter);
router.use(userRouter);
router.use(ticketRouter);

router.use(uploadRouter);

export { router as webRouters };
