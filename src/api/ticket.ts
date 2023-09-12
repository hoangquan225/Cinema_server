import express from 'express';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/asyncHandler';
import { BadRequestError } from '../utils/errors';
import AppConfig from '../common/config';
import { TicketServices } from '../services/ticketServices';
import { Ticket } from '../models/ticket';

const ticketRouter = express.Router();

const ticketService = new TicketServices();

ticketRouter.post(
  Endpoint.CREATE_TICKET,
  asyncHandler(async (req, res) => {

    const { data, status } = await ticketService.createTicket(
      new Ticket(req.body)
    );
    return res.json({ data, status });
  })
);

ticketRouter.post(
  Endpoint.GET_ALL_TICKET,
  asyncHandler(async (req, res) => {
    const { limit = 50, skip = 0, filmId, userId, scheduleId } = req.query;
    const { data, count } = await ticketService.getAllTicket({
      limit: Number(limit),
      skip: Number(skip),
      filmId: filmId,
      userId: userId,
      scheduleId: scheduleId,
    });
    return res.json({
      data,
      count,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

ticketRouter.post(
  Endpoint.GET_SEAT_OF_SCHEDULE_BY_TICKET,
  asyncHandler(async (req, res) => {
    const { filmId, scheduleId, showTime } = req.query;
    const data = await ticketService.getSeatOfSchedule({ filmId, scheduleId, showTime});

    return res.json({ data, status: AppConfig.STATUS_SUCCESS });
  })
);

// ticketRouter.post(
//   Endpoint.GET_TICKET_BY_USER,
//   asyncHandler(async (req, res) => {
//     const data = await ticketService.getTicketByUser(req.body);
//     return res.json({ data, status: AppConfig.STATUS_SUCCESS });
//   })
// );

export { ticketRouter };
