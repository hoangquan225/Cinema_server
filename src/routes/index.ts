import { Router } from 'express';
import { authRouter } from '../api/auth';
import { filmRouter } from '../api/film';
import { userRouter } from '../api/user';
import { ticketRouter } from '../api/ticket';
import { uploadRouter } from '../api/upload';
import { statisticRouter } from '../api/statistic';
import { scheduleRouter } from '../api/schedule';
import { testRouter } from '../api/apiTestApp';

const router = Router();

router.use(authRouter);
router.use(filmRouter);
router.use(userRouter);
router.use(ticketRouter);
router.use(scheduleRouter);

router.use(uploadRouter);
router.use(statisticRouter);

router.use(testRouter);

export { router as webRouters };
