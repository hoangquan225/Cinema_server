import { Request, Response, NextFunction, RequestHandler } from 'express';
import { extractToken } from '../utils/helpers';
import { jwtDecodeToken } from '../utils/jwtToken';
import * as _ from 'lodash';
import { FailureError, UnauthorizedError } from '../common/errors';
import asyncHandler from '../utils/async_handle';
import { UserModel } from '../database/users';

// export class AuthMiddleware {
//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = extractToken(req.headers['authorization'] || '');
//     try {
//       const decodedToken = await jwtDecodeToken(token);
//       next();
//     } catch (error) {
//       if (_.get(error, 'name', '') === 'TokenExpiredError') {
//         throw new UnauthorizedError('Token Expired');
//       }
//       throw new UnauthorizedError('Unauthorized');
//     }
//   }
// }

// const authMiddleware = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req?.headers?.authorization?.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//     try {
//       if (token) {
//         const decoded = jwtDecodeToken(token);
//         const user = await UserModel.findById(decoded?.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       throw new Error(
//         'Mã thông báo không được ủy quyền đã hết hạn, vui lòng đăng nhập lại'
//       );
//     }
//   } else {
//     throw new Error('Không có mã thông báo nào được đính kèm với tiêu đề');
//   }
// });

// const isAdmin = asyncHandler(async (req, res, next) => {
//   const { email } = req.user;
//   const adminUser = await User.findOne({ email });
//   if (adminUser.role !== 'admin') {
//     throw new Error('You are not an Admin');
//   } else {
//     next();
//   }
// });

// const protect = asyncHandler(async (req, res, next) => {
//   // 1) getting token and check of it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token)
//     return next(
//       new FailureError("you aren't logged in! please login to get access.", 401)
//     );

//   // 2) verification token
//   const decode = jwtDecodeToken(token);
//   if (decode) {
//     // 3) check if user still exists
//     const currentUser = await UserModel.findById(decode._id);
//     if (!currentUser)
//       return next(
//         new FailureError(
//           'the user belonging to this token does no longer exist.',
//           401
//         )
//       );

//     // 4) check  if user change password after the token was issued
//     // trong db lưu 1 trường passwordChangeAt, so sánh với iat của token.
//     // Nếu tgian password thay đổi lớn hơn ngày tạo token thì login lại.
//     //   if (currentUser.passwordChangeAt > decode.iat * 1000)
//     //     return next(
//     //       new FailureError(
//     //         "User recently changed password! Please login again",
//     //         401
//     //       )
//     //     );

//     // GRANT ACCESS TO  PROTECTED ROUTE
//     req.user = currentUser;
//   } else {
//     return next(new FailureError('token invalid', 401));
//   }
//   next();
// });

// module.exports = { authMiddleware };
