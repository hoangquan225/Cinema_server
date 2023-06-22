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
  Endpoint.GET_TICKET_BY_FILM_OR_DATE,
  asyncHandler(async (req, res) => {
    await ticketService.getAllTicket();

    return res.json();
  })
);

ticketRouter.post(
  Endpoint.GET_SEAT_OF_SCHEDULE_BY_TICKET,
  asyncHandler(async (req, res) => {
    const data = await ticketService.getSeatOfSchedule(req.body);

    return res.json({ data, status: AppConfig.STATUS_SUCCESS });
  })
);

export { ticketRouter };
