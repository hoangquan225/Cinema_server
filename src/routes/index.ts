import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';
import { userRouter } from '../api/user';
import { ticketRouter } from '../api/ticket';
import { uploadRouter } from '../api/upload';
import { statisticRouter } from '../api/statistic';
import { scheduleRouter } from '../api/schedule';
import { theaterRouter } from '../api/theater';
import { authMiddleware } from '../middleware/authMiddlewares';

const router = Router();

router.use(authRouter);
router.use(userRouter);

// router.use(authMiddleware)
router.use(filmRouter);
router.use(ticketRouter);
router.use(scheduleRouter);

router.use(uploadRouter);
router.use(statisticRouter);
router.use(theaterRouter);

export { router as webRouters };
