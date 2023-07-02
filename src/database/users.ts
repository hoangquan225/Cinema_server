import mongoose, { Document, Model, model, Types } from 'mongoose';
import { UserInfo } from '../models/user';
export const userTableName = 'User';
interface IUserSchema extends Model<UserInfoDoc> {}

export interface UserInfoDoc extends UserInfo, Document {
  _id: string;
}

const UserSchema = new mongoose.Schema<UserInfoDoc, IUserSchema>(
  {
    // account: { type: String, lowercase: true },
    name: String,
    avatar: String,
    email: String,
    password: String,
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    googleId: { type: String, default: '' },
    birth: String,
    gender: { type: Number, default: 0 },
    registerDate: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    userRole: { type: Number, default: 1 },
    lastLogin: { type: Number, default: 0 },
    token: { type: String, default: '' },
    passwordResetToken: String,
    passwordChangeAt: { type: Number, default: 0 },
    passwordResetExpires: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const UserModel = model(userTableName, UserSchema);
