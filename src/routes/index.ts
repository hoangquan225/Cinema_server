import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';
import { userRouter } from '../api/user';
import { ticketRouter } from '../api/ticket';

const router = Router();

router.use(authRouter);
router.use(filmRouter);
router.use(userRouter);
router.use(ticketRouter);

export { router as webRouters };
