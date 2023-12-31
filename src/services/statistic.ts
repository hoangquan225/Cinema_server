import _ from "lodash"
import moment from "moment"
import { UserModel } from "../database/users"
import { TicketModel } from "../database/ticket"

export default class StatisticService {
    loadNumByValueMonth = async (valueMonth: moment.Moment) => {
        const numRegiter = await UserModel.countDocuments({
            registerDate: { $gt: valueMonth.startOf('month').valueOf(), $lt: valueMonth.endOf('month').valueOf() }
        })
        const numLogin = await UserModel.countDocuments({
            lastLogin: { $gt: valueMonth.startOf('month').valueOf(), $lt: valueMonth.endOf('month').valueOf() }
        })

        // const numTicket = await TicketModel.countDocuments({
        //     createdAt: { $gt: valueMonth.startOf('month').valueOf(), $lt: valueMonth.endOf('month').valueOf() }
        // })

        const numTicket = await TicketModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: valueMonth.startOf('month').valueOf(), $lte: valueMonth.endOf('month').valueOf() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSeats: { $sum: { $size: '$seat' } }
                }
            }
        ]);

        const numPrice = await TicketModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: valueMonth.startOf('month').valueOf(), $lte: valueMonth.endOf('month').valueOf() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: '$price' }
                }
            }
        ]);

        return {
            numRegiter,
            numLogin,
            numTicket: numTicket[0]?.totalSeats || 0,
            numPrice: numPrice[0]?.totalPrice || 0,
            date: valueMonth.format("MM/YYYY")
        }
    }

    loadStatistic = async (payload: {
        startTime?: number,
        endTime?: number
    }) => {
        const { startTime, endTime } = payload
        
        if (!endTime && startTime) {
            const valueMonth = moment(startTime)
            return [await this.loadNumByValueMonth(valueMonth)]
        } else if (startTime && endTime) {
            const startDate = moment(startTime);
            const endDate = moment(endTime);

            const diffInMs = endDate.diff(startDate);
            const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));

            let months: string[] = [];
            for (let i = 0; i <= diffInMonths; i++) {
                months.push(startDate.format('MM/YYYY'));
                startDate.add(1, 'month');
            }

            const data = await Promise.all(months.map(async (month) => {
                return await this.loadNumByValueMonth(moment(month, "MM/YYYY"))
            }))
            return _.orderBy(data, ['date'], "asc")

        }
    }
}