import express from 'express';
import { AuthServices } from '../services/auth';
import Endpoint from '../common/endpoint';
import asyncHandler from '../utils/async_handle';
import { UserInfo } from '../models/user';
import { BadRequestError } from '../common/errors';
import AppConfig from '../common/config';
import { getCookieOptions } from '../utils/cookie';
// import { isValidEmail } from "../../submodule/utils/validation";
// import { BadRequestError } from "../../common/errors";
// import TTCSconfig from "../../submodule/common/config";
// import { getCookieOptions } from "../../utils/cookie";
// import Endpoint from "../../submodule/common/endpoint";

const authRouter = express.Router();

const authService = new AuthServices();
authRouter.post(
  Endpoint.LOGIN,
  asyncHandler(async (req, res) => {
    const body: { account: string; password: string; userRole?: number } =
      req.body;
    if (!body.account || !body.password) {
      throw res.json(new BadRequestError('invalid account or password'));
    } else {
      const { loginCode, token, ...userLogin } = await authService.login(body);
      return res.json({
        loginCode,
        userLogin,
        token,
      });
    }
  })
);

// authRouter.post(
//   Endpoint.LOGOUT,
//   asyncHandler(async (req, res) => {
//     const { status } = await authService.logout(req.body);
//     return res.json({
//       status,
//     });
//   })
// );

authRouter.post(
  Endpoint.REGISTER,
  asyncHandler(async (req, res, next) => {
    const body = <UserInfo>req.body;

    if (!body.account || !body.password)
      throw res.json(new BadRequestError('invalid account or password'));

    const { loginCode, token, message, ...registerData } =
      await authService.register(body, next);

    if (loginCode === AppConfig.LOGIN_SUCCESS) {
      res.cookie('token', token, { ...getCookieOptions() });
    }

    return res.json({ loginCode, registerData, token, message });
  })
);

// authRouter.post(
//   Endpoint.LOGIN_WITH_GOOGLE,
//   asyncHandler(async (req, res) => {
//     const body = req.body;

//     const { loginCode, token, ...userInfo } = await authService.loginWithGoogle(
//       body
//     );
//     return res.json({
//       loginCode,
//       userInfo,
//       token,
//     });
//   })
// );

export { authRouter };
