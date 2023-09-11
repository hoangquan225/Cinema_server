import AppConfig from '../common/config';
import { TicketModel } from '../database/ticket';
import { Ticket } from '../models/ticket';
import { BadRequestError } from '../utils/errors';

class TicketServices {
  createTicket = async (body: Ticket) => {
    try {
      console.log(body);
      
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

// TicketModel.find({})
//   .populate({
//     path: 'scheduleId',
//     populate: {
//       path: 'filmId',
//       model: 'Film',
//     },
//   })
//   .exec((err, tickets) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(tickets);
//   });

  getAllTicket = async (body: { limit: number; skip: number, filmId?: any, userId?: any, }) => {
    try {
      const { limit, skip, filmId, userId } = body;
      const query: any = {};
      
      if (filmId !== undefined && filmId.length !== 0) {
        query.filmId = filmId;
      }
      if (userId !== undefined && userId.length !== 0) {
        query.userId = userId;
      }

      const tickets = await TicketModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('filmId') 
        .populate('scheduleId')
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

  getSeatOfSchedule = async (body: { filmId: string; scheduleId: string }) => {
    try {
      const { scheduleId, filmId } = body;
      const tickets = await TicketModel.find({ scheduleId, filmId }); // Lấy chỉ trường "seat" của tất cả các documents
      const seatArray = tickets
        .map((ticket) => ticket.seat)
        .flat()
        .sort((a, b) => a - b); // Tạo một mảng chứa giá trị seat
      return seatArray;
    } catch (error) {
      throw new BadRequestError();
    }
  };

}

export { TicketServices };
