import moment from 'moment';
import AppConfig from '../common/config';
import { TicketModel } from '../database/ticket';
import { Ticket } from '../models/ticket';
import { BadRequestError } from '../utils/errors';

class TicketServices {
  createTicket = async (body: Ticket) => {
    try {
      const { scheduleId, showTime, filmId, seat } = body;
      const isOverlap = await this.isOverlapTicket(scheduleId, showTime, filmId, seat);

      if (isOverlap) {
        return {
          data: 'Vé tạo trùng lặp',
          status: -1,
        }
      }

      const newTicket = await TicketModel.create({
        ...body,
        createdAt: Date.now(),
      });
      return {
        data: newTicket,
        status: AppConfig.STATUS_SUCCESS,
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  isOverlapTicket = async (scheduleId, showTime, filmId, seatNumbers) => {
    const arrSeat = await this.getSeatOfSchedule({filmId, scheduleId, showTime })
    if (seatNumbers.some((number) => arrSeat.includes(number))) {
      return true
    }
    return false;
  };

  deleteTicket = async (ticketId: any) => {
    try {
      const deleteTicket = await TicketModel.findOneAndDelete({
        _id: ticketId
      });
      return {
        data: deleteTicket,
        status: deleteTicket ? AppConfig.STATUS_SUCCESS : AppConfig.STATUS_FAIL ,
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getAllTicket = async (body: { limit: number; skip: number, filmId?: any, userId?: any, scheduleId?: any, theater?:any}) => {
    try {
      const { limit, skip, filmId, userId, scheduleId, theater } = body;
      const query: any = {};
      
      if (filmId !== undefined && filmId.length !== 0) {
        query.filmId = filmId;
      }
      if (userId !== undefined && userId.length !== 0) {
        query.userId = userId;
      }

      if (scheduleId !== undefined && scheduleId.length !== 0) {
        query.scheduleId = scheduleId;
      }

      const tickets = await TicketModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('filmId') 
        .populate('scheduleId')
        .populate('userId')
        .exec();
        // .populate({
        //   path: 'scheduleId',
        //   populate: {
        //     path: 'filmId',
        //     model: 'Film',
        //   },
        // })
        // .exec();

      const count = await TicketModel.countDocuments(query)

      return {
        data: tickets.map((ticket) => new Ticket(ticket)),
        count
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getSeatOfSchedule = async (body: { filmId: any; scheduleId: any, showTime: any, theater?: any }) => {
    try {
      const { scheduleId, filmId, showTime, theater } = body;
      const tickets = await TicketModel.find({ scheduleId, showTime }); 
      const seatArray = tickets
        .map((ticket) => ticket.seat)
        .flat()
        .sort((a, b) => a - b);
      return seatArray;
    } catch (error) {
      throw new BadRequestError();
    }
  };
}

export { TicketServices };
