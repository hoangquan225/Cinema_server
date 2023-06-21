import Endpoint from '../common/endpoint';
import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { UserInfo } from '../models/user';
import UserService from '../services/userServices';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import { authMiddleware } from '../middleware/authMiddlewares';
import crypto from 'crypto';

const userRouter = express.Router();
const userService = new UserService();

userRouter.post(
  Endpoint.UPDATE_USER,
  authMiddleware,
  asyncHandler(async (req: any, res) => {
    const body = <UserInfo>req.body;
    const idUser = req.user.id;

    if (body.password)
      throw res.json(new BadRequestError('Cannot update password'));

    const { status, userInfo } = await userService.updateUserInfo(body, idUser);
    return res.json({
      status,
      userInfo,
    });
  })
);

userRouter.post(
  Endpoint.GET_USER_FROM_TOKEN,
  asyncHandler(async (req, res) => {
    const { token } = <{ token: string }>req.body;
    const user = await userService.checkUserFromToken(token);
    return res.json(user);
  })
);

userRouter.post(
  Endpoint.CHANGE_PASSWORD,
  authMiddleware,
  asyncHandler(async (req: any, res) => {
    const body: { password: string; newPassword: string } = req.body;
    const idUser = req.user.id;

    if (!body.password || !body.newPassword)
      throw res.json(new BadRequestError('invalid newPassword or password'));

    const { loginCode, ...UserInfo } = await userService.changePassword({
      ...body,
      idUser,
    });
    return res.json({
      loginCode,
      UserInfo,
    });
  })
);

userRouter.post(
  '/test',
  asyncHandler(async (req: any, res) => {
    const resetToken = crypto.randomBytes(3).toString('hex');

    const reset = crypto.createHash('sha256').update(resetToken).digest('hex');
    return res.json({ resetToken, reset });
  })
);

userRouter.post(Endpoint.FORGOT_PASSWORD, userService.forgotPassword);

export { userRouter };
