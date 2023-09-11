import AppConfig from '../common/config';
import { ScheduleModel } from '../database/schedule';
import { Schedule } from '../models/schedule';
import { BadRequestError } from '../utils/errors';

class ScheduleServices {
  updateSchedule = async (body: Schedule) => {
    if (body?.id) {
      // update
      try {
        const schedule = await ScheduleModel.findOneAndUpdate(
          { _id: body?.id },
          {
            $set: {
              ...body,
              updateDate: Date.now(),
            },
          },
          { new: true }
        );
        if (schedule) {
          return {
            data: schedule,
            status: AppConfig.STATUS_SUCCESS,
          };
        } else {
          return {
            data: 'không tồn tại',
            status: AppConfig.STATUS_NO_EXIST,
          };
        }
      } catch (error) {
        throw new BadRequestError();
      }
    } else {
      // create
      try {
        const newSchedule = await ScheduleModel.create({
          ...body,
          createAt: Date.now()
        });
        return {
          data: newSchedule,
          status: AppConfig.STATUS_SUCCESS,
        };
      } catch (error) {
        throw new BadRequestError();
      }
    }
  };

  getSchedule = async (body: { limit: number; skip: number, filmId?: any }) => {
    try {
      const { limit, skip, filmId } = body;
      const query: any = {};

      if (filmId !== undefined && filmId.length !== 0) {
        query.filmId = filmId;
      }

      const schedules = await ScheduleModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('filmId')

      const count = await ScheduleModel.countDocuments(query)

      return {
        data: schedules.map((schedule) => new Schedule(schedule)),
        count
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };


  isOverlap = async (newStartTime, newEndTime) => {
    const scheduleList = await ScheduleModel.find()
    for (const schedule of scheduleList) {
      if (
        (newStartTime >= schedule.startTime && newStartTime <= schedule.endTime) ||
        (newEndTime >= schedule.startTime && newEndTime <= schedule.endTime) ||
        (newStartTime <= schedule.startTime && newEndTime >= schedule.endTime)
      ) {
        return true;
      }
    }
    return false;
  };

  checkOverlapMiddleware = async (req, res, next) => {
    try {
      const newStartTime = req.body.startTime;
      const newEndTime = req.body.endTime;
      const isOverlap = await this.isOverlap(newStartTime, newEndTime);

      if (isOverlap) {
        return res.json({
          message: 'Lịch chiếu trùng lặp',
          status: -1,
          statusCode: 400
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        status: -1,
      });
    }
  };
}


export { ScheduleServices };
