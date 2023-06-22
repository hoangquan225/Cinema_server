import mongoose, { Document, Model, model, Types } from 'mongoose';
import { Ticket } from '../models/ticket';
export const fileTableName = 'ticket';
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
    seat: [Number], // vi tri ghe
    showTime: { type: Number, required: true }, // ngay, gio chieu phim
    price: Number,
    createdAt: Number,
  },
  {
    versionKey: false,
  }
);

export const TicketModel = model(fileTableName, TicketSchema);
