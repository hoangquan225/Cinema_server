import express from 'express';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/async_handle';
import { BadRequestError } from '../common/errors';
import AppConfig from '../common/config';
import { FilmServices } from '../services/filmServices';
import { Film } from '../models/film';

const filmRouter = express.Router();

const filmService = new FilmServices();
filmRouter.post(
  Endpoint.UPDATE_FILM,
  asyncHandler(async (req, res) => {
    const { data, status } = await filmService.updateFilm(new Film(req.body));

    return res.json({ data, status });
  })
);

filmRouter.post(
  Endpoint.GET_FILM_BY_ID,
  asyncHandler(async (req, res, next) => {
    return res.json({});
  })
);

export { filmRouter };
