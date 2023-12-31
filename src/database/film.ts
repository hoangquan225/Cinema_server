import mongoose, { Document, Model, model, Types } from 'mongoose';
import { Film } from '../models/film';
import AppConfig from '../common/config';
export const fileTableName = 'Film';
interface IFilmISchema extends Model<IFilmDocument> { }

export interface IFilmDocument extends Film, Document {
  id: string;
}

const FilmSchema = new mongoose.Schema<IFilmDocument, IFilmISchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    category: [
      {
        type: String,
        required: true,
        default: AppConfig.FilmCategories.DRAFT,
      },
    ],
    director: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    actor: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    language: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    runningTime: {
      type: Number,
      required: true,
    },
    heartTotal: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: Number,
      required: true,
      default: AppConfig.FilmsStatus.DRAFT,
    },
    schedule: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const FilmModel = model(fileTableName, FilmSchema);
