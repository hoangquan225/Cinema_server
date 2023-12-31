import mongoose, { Document, Model, model, Types } from 'mongoose';
import { Theater } from '../models/theater';
export const fileTableName = 'Theater';
interface ITheaterSchema extends Model<ITheaterDocument> { }

export interface ITheaterDocument extends Theater, Document {
    id: string;
}

const TheaterSchema = new mongoose.Schema<ITheaterDocument, ITheaterSchema>(
    {
        name: String,
        nRoom: Number,
        type: Number, //1: Thanh xuan, 2: Long Bien, 3: Royal city, 4: Time City, 5: Ha Dong, 6: Giai Phong
        provinceCode: String,
        location: String,
        createdAt: Number
    }
);

export const TheaterModel = model(fileTableName, TheaterSchema);
