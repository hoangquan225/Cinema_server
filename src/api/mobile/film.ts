import { Router } from "express";
import asyncHandler from '../../utils/asyncHandler';
import { FilmServices } from '../../services/filmServices';
import { Film } from '../../models/film';

const router = Router();
const filmServices = new FilmServices();

router.get("/get-film-by-id", asyncHandler(async (req, res) => {
    if (!req.query.filmId) return res.json({
        data: 'cannot find param categoryid',
        status: -1
    })
    console.log(req.query.filmId);
    
    const id = `${req.query.filmId}`
    const data = await filmServices.getFilmById(id)
    return res.json(data)
}))

export { router as filmMobileRouter }