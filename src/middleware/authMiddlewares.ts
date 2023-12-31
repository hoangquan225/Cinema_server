import { Request, Response, NextFunction, RequestHandler } from 'express';
import { extractToken } from '../utils/helpers';
import { jwtDecodeToken } from '../utils/jwtToken';
import * as _ from 'lodash';
import { FailureError, UnauthorizedError } from '../utils/errors';
import asyncHandler from '../utils/asyncHandler';
import { UserModel } from '../database/users';
import { UserInfo } from '../models/user';

const authMiddleware = asyncHandler(async (req: any, res, next: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    // return next(new UnauthorizedError('Token Invalid'));
    throw res.json(new UnauthorizedError('Token Invalid'));

  const decode = jwtDecodeToken(token);
  if (decode) {
    const currentUser = await UserModel.findById(decode._id);
    if (!currentUser)
      return next(
        new UnauthorizedError(
          'the user belonging to this token does no longer exist.'
        )
      );
    // 4) check  if user change password after the token was issued
    // trong db lưu 1 trường passwordChangeAt, so sánh với iat của token.
    // Nếu tgian password thay đổi lớn hơn ngày tạo token thì login lại.
    // if (currentUser.passwordChangeAt > decode.iat * 1000)
    //   return next(
    //     new UnauthorizedError(
    //       'User recently changed password! Please login again'
    //     )
    //   );
    // GRANT ACCESS TO  PROTECTED ROUTE
    req.user = currentUser;
  } else {
    // return next(new UnauthorizedError('Token Expired'));
    throw res.json(new UnauthorizedError('Token Expired'));
  }
  next();
});

// export class AuthMiddleware {
//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = extractToken(req.headers['authorization'] || '');
//     try {
//       const decodedToken = await jwtDecodeToken(token);
//       next();
//     } catch (error) {
//       // if (_.get(error, 'name', '') === 'TokenExpiredError') {
//       //   throw new UnauthorizedError('Token Expired');
//       // }
//       throw new UnauthorizedError('Unauthorized');
//     }
//   }
// }

const isAdmin = asyncHandler(async (req: any, res, next: any) => {
  const { email } = req.user;
  const adminUser = new UserInfo(await UserModel.findOne({ email }));
  if (adminUser.userRole !== 0) {
    throw res.json(new UnauthorizedError('You are not an Admin'));
  } else {
    next();
  }
});

export { authMiddleware, isAdmin };
