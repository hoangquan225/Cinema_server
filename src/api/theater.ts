import express from 'express';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/asyncHandler';
import { BadRequestError } from '../utils/errors';
import AppConfig from '../common/config';
import { authMiddleware } from '../middleware/authMiddlewares';
import { TheaterServices } from '../services/theaterServices';
import { Theater } from '../models/theater';

const theaterRouter = express.Router();

const theaterService = new TheaterServices();

theaterRouter.post(
  Endpoint.UPDATE_THEATER, 
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { data, status } = await theaterService.updateTheater(
      new Theater(req.body)
    );
    return res.json({ data, status });
  })
);

theaterRouter.post(
  Endpoint.DELETE_THEATER,
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { data, status } = await theaterService.deleteTheater(id);
    return res.json({ data, status });
  })
);

theaterRouter.get(
  Endpoint.GET_THEATER,
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { limit = 100, skip = 0,  type = 0, provinceCode } = req.query;
    const { data, count } = await theaterService.getTheater({
      limit: Number(limit),
      skip: Number(skip),
      type: Number(type),
      provinceCode
    });
    return res.json({
      data,
      count,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

theaterRouter.get(
  Endpoint.GET_THEATER_BY_ID,
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { data } = await theaterService.getTheaterById(req.query.id);
    return res.json({
      data,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

export { theaterRouter };
