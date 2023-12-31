import mongoose, { Document, Model, model, Types } from 'mongoose';
import { Ticket } from '../models/ticket';
export const fileTableName = 'Ticket';
interface ITicketISchema extends Model<ITicketDocument> {}

export interface ITicketDocument extends Ticket, Document {
  id: string;
}

const TicketSchema = new mongoose.Schema<ITicketDocument, ITicketISchema>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    filmId: {
      type: mongoose.Types.ObjectId,
      ref: 'Film',
    },
    scheduleId: {
      type: mongoose.Types.ObjectId,
      ref: 'Schedule',
    },
    seat: [Number], // vi tri ghe
    // showTime: { type: Number, required: true }, // ngay, gio chieu phim
    showDate: Number,
    showTime: String,
    theater: Number,
    price: Number,
    paid: { type: Boolean, default: false },
    createdAt: Number,
  },
  {
    versionKey: false,
  }
);

export const TicketModel = model(fileTableName, TicketSchema);
