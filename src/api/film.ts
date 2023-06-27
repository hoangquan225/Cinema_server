import express from 'express';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/asyncHandler';
import { BadRequestError } from '../utils/errors';
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
    const data = await filmService.getFilmById(`${req.query.id}`);
    return res.json({
      data,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

filmRouter.get(
  Endpoint.SEARCH_FILM,
  asyncHandler(async (req, res, next) => {
    const data = await filmService.searchFilmByName(`${req.query.name}`);
    res.json({ data, status: AppConfig.STATUS_SUCCESS });
  })
);

filmRouter.get(
  Endpoint.GET_ALL_FILM,
  asyncHandler(async (req, res, next) => {
    const { limit = 10, skip = 0 } = req.query;
    const { data } = await filmService.getAllFilm({
      limit: Number(limit),
      skip: Number(skip),
    });
    return res.json({
      data,
      status: AppConfig.STATUS_SUCCESS,
    });
  })
);

filmRouter.post(
  Endpoint.GET_FILM_BY_STATUS,
  asyncHandler(async (req, res, next) => {
    const data = await filmService.getFilmByStatus(Number(req.query.status));
    res.json({ data, status: AppConfig.STATUS_SUCCESS });
  })
);

filmRouter.post(
  Endpoint.GET_FILM_BY_CATEGORY,
  asyncHandler(async (req, res, next) => {
    const data = await filmService.getFilmByCategory(Number(req.query.category));
    res.json({ data, status: AppConfig.STATUS_SUCCESS });
  })
);



filmRouter.post(
  Endpoint.AUTO_UPDATE_STATUS_FILM,
  asyncHandler(async (req, res, next) => {
    const { status } = await filmService.autoUpdateStatusFilm();
    res.json({ status });
  })
);
export { filmRouter };
