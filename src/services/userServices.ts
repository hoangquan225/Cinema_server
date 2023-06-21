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
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
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
        userInfo,
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

  getUserById = async (body: { userId: string }): Promise<UserInfo> => {
    const userInfo = await UserModel.findOne({ _id: body.userId });
    return new UserInfo(userInfo);
  };

  forgotPassword = asyncHandler(async (req, res, next: any) => {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return next(new BadRequestError('Email not exits'));
    }

    //2> generate the random reset token
    const resetToken = this.createPasswordResetToken(user);
    await user.save({ validateBeforeSave: false });

    console.log(resetToken);
    console.log(user);

    const resetURl = `${req.protocol}://${req.get(
      'host'
    )}/api/user/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURl}.\n If you didn't forget your password, please ignore this email`;

    try {
      await sendEmail(
        user.email,
        'Your password reset token (valid for 10 min)',
        message
      );

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.log(error);
      return next(
        new FailureError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  });

  resetPassword = asyncHandler(async (req, res, next: any) => {
    try {
      // 1) Get user based on the token
      const { resetToken, password, email } = req.body;
      // const passEncode = encrypt(req.body.password);

      const newPasswordEncode = encodeSHA256Pass(email, password);

      const hashesToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      // .update(req.params.token)

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
            passwordResetToken: undefined,
            passwordResetExpires: undefined,
            passwordChangeAt: Date.now() - 1000,
          },
        },
        { new: true }
      );

      // 4) Log the user in, send JWT
      const token = jwtEncode(user._id);
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
