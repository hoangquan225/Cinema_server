import express from 'express';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/asyncHandler';
import { BadRequestError } from '../utils/errors';
import AppConfig from '../common/config';
import { ScheduleServices } from '../services/scheduleServices';
import { Schedule } from '../models/schedule';
import { authMiddleware, isAdmin } from '../middleware/authMiddlewares';

const scheduleRouter = express.Router();

const scheduleService = new ScheduleServices();

scheduleRouter.use(authMiddleware)

scheduleRouter.post(
  Endpoint.UPDATE_SCHEDULE,
  isAdmin,
  scheduleService.checkOverlapMiddleware,
  asyncHandler(async (req, res) => {
    const { data, status } = await scheduleService.updateSchedule(
      new Schedule(req.body)
    );
    return res.json({ data, status });
  })
);

scheduleRouter.post(
  Endpoint.DELETE_SCHEDULE,
  asyncHandler(async (req, res) => {
    const { scheduleId } = req.query;
    const { data, status } = await scheduleService.deleteSchedule(scheduleId);
    return res.json({ data, status });
  })
);

scheduleRouter.post(
  Endpoint.GET_SCHEDULE,
  asyncHandler(async (req, res) => {
    const { limit = 100, skip = 0, filmId, isAll = false, theater, roomNum } = req.query;
    const { data, count } = await scheduleService.getSchedule({
      limit: Number(limit),
      skip: Number(skip),
      filmId: filmId,
      isAll,
      theater: theater,
      roomNum: roomNum
    });
    return res.json({
      data,
      count,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

export { scheduleRouter };
