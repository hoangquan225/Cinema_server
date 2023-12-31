import { Router } from "express";
import asyncHandler from '../../utils/asyncHandler';
import { FilmServices } from '../../services/filmServices';
import { Film } from '../../models/film';
import { TicketServices } from "../../services/ticketServices";

const router = Router();
const filmServices = new FilmServices();
const ticketService = new TicketServices();


router.get("/get-film-by-id", asyncHandler(async (req, res) => {
    if (!req.query.filmId) return res.json({
        data: 'cannot find param categoryid',
        status: -1
    })
    console.log("/get-film-by-id| " + req.query.filmId);
    
    const id = `${req.query.filmId}`
    const data = await filmServices.getFilmById(id)
    return res.json(data)
}))


router.post("/get-film-by-id", asyncHandler(async (req, res) => {
    const id = `${req.body.filmId}`
    const data = await filmServices.getFilmById(id)
    return res.json({ data, status: 0 })
}))

router.post("/get-schedule", asyncHandler(async (req, res) => {
    const id = `${req.body.filmId}`
    const data = await filmServices.getSchedule({ filmId:id, isAll: false })
    return res.json({ data, status: 0 })
}))

router.post("/get-seat-of-schedule", asyncHandler(async (req, res) => {
    const scheduleId = `${req.body.scheduleId}`
    const showTime = `${req.body.showTime}`
    const filmId = `${req.body.filmId}`

    const data = await ticketService.getSeatOfSchedule({ filmId, scheduleId, showTime});

    return res.json({ data, status: 0 })
}))


export { router as filmMobileRouter }