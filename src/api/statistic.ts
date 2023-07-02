import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import Endpoint from '../common/endpoint';
import AppConfig from '../common/config'
import StatisticService from '../services/statistic';

const statisticRouter = express.Router();
const statisticService = new StatisticService();

statisticRouter.post(Endpoint.LOAD_STATISTIC, asyncHandler(async (req, res) => {
    const data = await statisticService.loadStatistic(req.body)
    
    return res.json({
        data,
        status: AppConfig.STATUS_SUCCESS
    })
}))

export {statisticRouter}