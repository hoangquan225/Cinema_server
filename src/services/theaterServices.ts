import moment from 'moment';
import AppConfig from '../common/config';
import { BadRequestError } from '../utils/errors';
import { TheaterModel } from '../database/theater';
import { Theater } from '../models/theater';

class TheaterServices {
  updateTheater = async (body: Theater) => {
    if (body?.id) {
      // update
      try {
        const theater = await TheaterModel.findOneAndUpdate(
          { _id: body?.id },
          {
            $set: {
              ...body,
              updateDate: Date.now(),
            },
          },
          { new: true }
        );
        if (theater) {
          return {
            data: theater,
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
        const newTheater = await TheaterModel.create({
          ...body,
          createAt: Date.now()
        });
        return {
          data: newTheater,
          status: AppConfig.STATUS_SUCCESS,
        };
      } catch (error) {
        throw new BadRequestError();
      }
    }
  };

  getTheater = async (body: { limit: number; skip: number, type?: number, provinceCode?: any}) => {
    try {
      const { limit, skip, type, provinceCode } = body;
      const query: any = {};

      if (type !== undefined && type != 0) {
        query.type = type;
      }

      if (provinceCode !== undefined && provinceCode.length !== 0) {
        query.provinceCode = provinceCode;
      }
      
      const theaters = await TheaterModel.find(query)
        .skip(skip)
        .limit(limit)

      const count = await TheaterModel.countDocuments(query)

      return {
        data: theaters.map((theater) => new Theater(theater)),
        count
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getTheaterById = async (theaterId) => {
    try {
      const theater = await TheaterModel.findById(theaterId)
      return {
        data: new Theater(theater)
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  deleteTheater = async (theaterId: any) => {
    try {
      const deleteTheater = await TheaterModel.findOneAndDelete({
        _id: theaterId
      });
      return {
        data: deleteTheater,
        status: deleteTheater ? AppConfig.STATUS_SUCCESS : AppConfig.STATUS_FAIL ,
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };
}


export { TheaterServices };
