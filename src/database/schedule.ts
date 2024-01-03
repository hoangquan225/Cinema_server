import mongoose, { Document, Model, model, Types } from 'mongoose';
import { Schedule } from '../models/schedule';
export const fileTableName = 'Schedule';
interface IScheduleISchema extends Model<IScheduleDocument> { }

export interface IScheduleDocument extends Schedule, Document {
    id: string;
}

const ScheduleSchema = new mongoose.Schema<IScheduleDocument, IScheduleISchema>(
    {
        filmId: {
            type: mongoose.Types.ObjectId,
            ref: 'Film',
        },
        romId: String,
        // seat: [Number], // vi tri ghe
        showTime: [String],
        showDate: Number,
        startTime: Number,
        endTime: Number,
        nSeat: Number,
        theater: Number,
        roomNum: Number
    },
    {
        versionKey: false,
        timestamps: true
    }
);

export const ScheduleModel = model(fileTableName, ScheduleSchema);
