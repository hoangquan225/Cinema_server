// import _ from "lodash";
import crypto from 'crypto';
import AppConfig from '../common/config';
import { UserInfo } from '../models/user';
import { UserModel } from '../database/users';
import { jwtDecodeToken, jwtEncode } from '../utils/jwtToken';
import { decrypt, encodeSHA256Pass, encrypt } from '../utils/crypto';
import { BadRequestError, FailureError } from '../utils/errors';
import asyncHandler from '../utils/asyncHandler';
import sendEmail from '../utils/sendEmail';

export default class UserService {
  private processPass(userObject: { account: string; password: string }) {
    const decryptedResult = decrypt(userObject.password);
    const encodedPassword = encodeSHA256Pass(
      userObject.account,
      decryptedResult
    );
    return encodedPassword;
  }

  private createPasswordResetToken = (user: UserInfo) => {
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 5 * 60 * 1000;
    return resetToken;
  };

  updateStatusUser = async (
    body: {userId: string, status: number}
  ) => {
    try {
      const { userId, status} = body
      
      const userUpdate = await UserModel.findOneAndUpdate(
        { _id: userId },
        { status: status },
        { new: true }
      );
      console.log({userUpdate});

      const userInfo = new UserInfo(userUpdate);
      return {
        status: AppConfig.STATUS_SUCCESS,
        userInfo,
      };
    } catch (err) {
      return {
        status: AppConfig.STATUS_FAIL,
        userInfo: null,
      };
    }
  };

  updateUserInfo = async (
    body: UserInfo,
    idUser: string
  ): Promise<{
    status: number;
    userInfo: UserInfo | null;
  }> => {
    try {
      let userInfo = new UserInfo(body);

      const userUpdate = await UserModel.findOneAndUpdate(
        { _id: idUser },
        { $set: { ...body } },
        { new: true }
      );
      userInfo = new UserInfo(userUpdate);
      return {
        status: AppConfig.STATUS_SUCCESS,
        userInfo,
      };
    } catch (err) {
      return {
        status: AppConfig.STATUS_FAIL,
        userInfo: null,
      };
    }
  };

  checkUserFromToken = async (
    token: string
  ): Promise<{
    status: number;
    userInfo: UserInfo | null;
  }> => {
    const tokenDecode = jwtDecodeToken(token);
    let status = AppConfig.STATUS_SUCCESS;
    // find db
    try {
      const userInfo = await UserModel.findOne({ _id: tokenDecode?._id });
      if (!userInfo) {
        status = AppConfig.STATUS_FAIL;
      }
      return {
        status,
        userInfo: new UserInfo(userInfo),
      };
    } catch (error) {
      return {
        status: AppConfig.STATUS_FAIL,
        userInfo: null,
      };
    }
  };

  changePassword = async (body: {
    password: string;
    newPassword: string;
    idUser: string;
  }): Promise<UserInfo> => {
    const { newPassword, password, idUser } = body;
    let userInfo = new UserInfo();
    try {
      const checkUser = new UserInfo(await UserModel.findOne({ _id: idUser }));
      const passEncode = encodeSHA256Pass(checkUser?.email, password);

      if (passEncode === checkUser.password) {
        // const newPasswordEncode = this.processPass({
        //   account: checkUser?.account,
        //   password: newPassword,
        // });
        const newPasswordEncode = encodeSHA256Pass(
          checkUser?.email,
          newPassword
        );

        const userUpdatePassword = await UserModel.findOneAndUpdate(
          { _id: idUser },
          {
            $set: { password: newPasswordEncode, passwordChangeAt: Date.now() },
          },
          { new: true }
        );
        userInfo = new UserInfo(userUpdatePassword);
        userInfo.loginCode = AppConfig.LOGIN_SUCCESS;

        return userInfo;
      } else {
        userInfo.loginCode = AppConfig.LOGIN_WRONG_PASSWORD;
      }

      return userInfo;
    } catch (error) {
      userInfo.loginCode = AppConfig.LOGIN_FAILED;
      return userInfo;
    }
  };

  getUserById = async (userId: string): Promise<UserInfo> => {
    try {
      const userInfo = await UserModel.findOne({ _id: userId });
      return new UserInfo(userInfo);
    } catch (error) {
      throw new BadRequestError();
    }
  };

  getAllUser = async () => {
    try {
      const users = await UserModel.find({ });
      return {
        data: users.map((user) => new UserInfo(user)),
        status: AppConfig.STATUS_SUCCESS
      };
    } catch (error) {
      throw new BadRequestError();
    }
  };

  forgotPassword = asyncHandler(async (req, res, next: any) => {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return next(new BadRequestError('Email not exits'));
    }

    const resetToken = this.createPasswordResetToken(user);
    await user.save({ validateBeforeSave: false });

    const resetURl = `${req.protocol}://${req.get(
      'host'
    )}/api/user/reset-password/${resetToken}`;

    const html = `<p>Here is the code to retrieve your password: <h1 style="color:#04aa6d;text-align:center;">${resetToken}</h1>Your password reset code valid for 5 minutes, Do not share it with anyone.</p>`;
    try {
      await sendEmail(
        user.email,
        'Your password reset token (valid for 5 min)',
        html
      );

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (error) {
      user.passwordResetToken = '';
      user.passwordResetExpires = 0;
      await user.save({ validateBeforeSave: false });

      return next(
        new FailureError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  });

  checkResetPassword = asyncHandler(async (req, res, next: any) => {
    try {
      const { resetToken, email } = req.body;

      const hashesToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await UserModel.findOne({
        email: email,
        passwordResetToken: hashesToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        // return next(new FailureError('Token is invalid or has expired', 403));
        return res.status(200).json({
          status: AppConfig.STATUS_FAIL,
          mesage: 'Token is invalid or has expired',
          data: false,
        });
      }

      user.passwordResetExpires =
        Number(user.passwordResetExpires) + 5 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: AppConfig.STATUS_SUCCESS,
        data: true,
        user,
      });
    } catch (error) {
      throw res.json(new BadRequestError());
    }
  });

  resetPassword = asyncHandler(async (req, res, next: any) => {
    try {
      // 1) Get user based on the token
      const { resetToken, newPassword, email } = req.body;
      // const passEncode = encrypt(req.body.password);

      const newPasswordEncode = encodeSHA256Pass(email, newPassword);
      const hashesToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await UserModel.findOne({
        passwordResetToken: hashesToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      // 2) if token has not expired, and there is user, set the new password
      // 3) Update changedPasswordAt property for the user
      if (!user) {
        return next(new FailureError('Token is invalid or has expired', 403));
      }

      const userUpdatePassword = await UserModel.findOneAndUpdate(
        {
          passwordResetToken: hashesToken,
          passwordResetExpires: { $gt: Date.now() },
        },
        {
          $set: {
            password: newPasswordEncode,
            passwordResetToken: '',
            passwordResetExpires: 0,
            passwordChangeAt: Date.now() - 1000,
          },
        },
        { new: true }
      );

      // 4) Log the user in, send JWT
      const token = jwtEncode(user?._id, 60 * 60 * 24 * 30);

      res.status(200).json({
        status: AppConfig.STATUS_SUCCESS,
        userUpdatePassword,
        token,
      });
    } catch (error) {
      throw res.json(new BadRequestError());
    }
  });
}
