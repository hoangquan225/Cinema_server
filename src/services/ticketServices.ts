import AppConfig from '../common/config';
import { TicketModel } from '../database/ticket';
import { Ticket } from '../models/ticket';
import { BadRequestError } from '../utils/errors';

class TicketServices {
  createTicket = async (body: Ticket) => {
    try {
      const newTicket = await TicketModel.create({
        ...body,
        createdAt: Date.now(),
      });
      return {
        data: newTicket,
        status: AppConfig.STATUS_SUCCESS,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestError();
    }
  };

  getAllTicket = async () => {};

  getSeatOfSchedule = async (body: { filmId: string; showTime: number }) => {
    try {
      const { showTime, filmId } = body;
      console.log({ showTime, filmId });

      const tickets = await TicketModel.find({ showTime, filmId }); // Lấy chỉ trường "seat" của tất cả các documents
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
