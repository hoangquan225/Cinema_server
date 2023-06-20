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
