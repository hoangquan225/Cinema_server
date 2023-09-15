import moment from 'moment';
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

  getSchedule = async (body: { limit: number; skip: number, filmId?: any, isAll?: any }) => {
    try {
      const { limit, skip, filmId, isAll } = body;
      const query: any = { };

      if(!isAll) {
        query.showDate = { $gt: Date.now() } ;
      }

      if (filmId !== undefined && filmId.length !== 0) {
        query.filmId = filmId;
      }
      
      const schedules = await ScheduleModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate('filmId')
        .sort({showDate: 1})

      const count = await ScheduleModel.countDocuments(query)

      return {
        data: schedules.map((schedule) => new Schedule(schedule)),
        count
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  isOverlap = async (showDate, showTime, filmId) => {
    const scheduleList = await ScheduleModel.find()
    for (const existingSchedule of scheduleList) {
      if (moment(existingSchedule.showDate).format("DD/MM/YYYY") === moment(showDate).format("DD/MM/YYYY")) {
        if (existingSchedule.showTime.some(element => showTime.includes(element))) {
          if(existingSchedule.filmId?.toString() === filmId) return false
          else return true;
        }
      }
    }
    return false;
  };

  checkOverlapMiddleware = async (req, res, next) => {
    try {
      const showTime = req.body.showTime;
      const showDate = req.body.showDate;
      const filmId = req.body.filmId;
      const isOverlap = await this.isOverlap(showDate, showTime, filmId);
      if (isOverlap) {
        return res.json({
          message: 'Lịch chiếu trùng lặp',
          status: -1,
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
