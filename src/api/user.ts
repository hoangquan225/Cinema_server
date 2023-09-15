import Endpoint from '../common/endpoint';
import express from 'express';
import asyncHandler from '../utils/asyncHandler';
import { UserInfo } from '../models/user';
import UserService from '../services/userServices';
import { isValidObjectId } from 'mongoose';
import { BadRequestError } from '../utils/errors';
import { authMiddleware, isAdmin } from '../middleware/authMiddlewares';
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
  Endpoint.UPDATE_STATUS_USER,
  authMiddleware,
  isAdmin,
  asyncHandler(async (req: any, res) => {
    const body = req.body;
    const { status, userInfo } = await userService.updateStatusUser(body);
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
  Endpoint.GET_USER_BY_ID,
  asyncHandler(async (req, res) => {
    const user = await userService.getUserById(`${req.query.id}`);
    return res.json(new UserInfo(user));
  })
);

userRouter.post(
  Endpoint.GET_ALL_USER,
  asyncHandler(async (req, res) => {
    const {data, status} = await userService.getAllUser();
    return res.json({data, status} );
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

userRouter.post(Endpoint.FORGOT_PASSWORD, userService.forgotPassword);
userRouter.post(Endpoint.CHECK_RESET_PASSWORD, userService.checkResetPassword);
userRouter.post(Endpoint.RESET_PASSWORD, userService.resetPassword);

export { userRouter };
