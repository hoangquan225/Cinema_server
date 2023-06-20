// import _ from "lodash";
import mongoose from 'mongoose';
import AppConfig from '../common/config';
import { UserInfo } from '../models/user';
import { UserModel } from '../database/users';
import { jwtDecodeToken } from '../utils/jwtToken';
import { decrypt, encodeSHA256Pass, encrypt } from '../utils/crypto';
import { BadRequestError } from '../common/errors';

export default class UserService {
  private processPass(userObject: { account: string; password: string }) {
    const decryptedResult = decrypt(userObject.password);
    const encodedPassword = encodeSHA256Pass(
      userObject.account,
      decryptedResult
    );
    return encodedPassword;
  }

  // updateUserInfo = async (body: {
  //   token: string;
  //   userInfo: UserInfo;
  // }): Promise<{
  //   status: number;
  //   userInfo: UserInfo | null;
  // }> => {
  //   const tokenDecode = jwtDecodeToken(body.token);
  //   let userInfo = new UserInfo(body.userInfo);
  //   let status = AppConfig.STATUS_SUCCESS;
  //   try {
  //     // const findUser = await UserModel.findOne({ _id: body.userInfo._id });
  //     const userUpdate = await UserModel.findOneAndUpdate(
  //       { _id: tokenDecode._id },
  //       { $set: { ...body.userInfo } },
  //       { new: true }
  //     );
  //     userInfo = new UserInfo(userUpdate);

  //     return {
  //       status,
  //       userInfo,
  //     };
  //   } catch (err) {
  //     return {
  //       status: AppConfig.STATUS_FAIL,
  //       userInfo: null,
  //     };
  //   }
  // };

  //   checkUserFromToken = async (
  //     token: string
  //   ): Promise<{
  //     status: number;
  //     userInfo: UserInfo | null;
  //   }> => {
  //     const tokenDecode = jwtDecodeToken(token);
  //     let status = AppConfig.STATUS_SUCCESS;
  //     // find db
  //     try {
  //       const userInfo = await UserModel.findOne({ _id: tokenDecode?._id });
  //       if (!userInfo) {
  //         status = AppConfig.STATUS_FAIL;
  //       }
  //       return {
  //         status,
  //         userInfo,
  //       };
  //     } catch (error) {
  //       return {
  //         status: AppConfig.STATUS_FAIL,
  //         userInfo: null,
  //       };
  //     }
  //   };

  changePassword = async (body: {
    token: string;
    password: string;
    newPassword: string;
  }): Promise<UserInfo> => {
    const { newPassword, token, password } = body;
    const tokenDecode = jwtDecodeToken(token);

    let userInfo = new UserInfo();
    try {
      const checkUser = new UserInfo(
        await UserModel.findOne({ _id: tokenDecode?._id })
      );
      // const passEncode = this.processPass({
      //   account: checkUser?.account,
      //   password: password,
      // });
      const passEncode = encodeSHA256Pass(checkUser?.email, password);

      if (checkUser._id) {
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
            { _id: tokenDecode?._id },
            { $set: { password: newPasswordEncode } },
            { new: true }
          );
          userInfo = new UserInfo(userUpdatePassword);
          userInfo.loginCode = AppConfig.LOGIN_SUCCESS;

          return userInfo;
        } else {
          userInfo.loginCode = AppConfig.LOGIN_WRONG_PASSWORD;
        }
      } else {
        userInfo.loginCode = AppConfig.LOGIN_TOKEN_INVALID;
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

  //   updateStudyedForUser = async (body: {
  //     idTopic: string;
  //     idCourse: string;
  //     idUser: string;
  //     status: number;
  //     timeStudy: number;
  //     score: number;
  //     correctQuestion: number;
  //     answers: Array<{
  //       idQuestion: string;
  //       idAnswer: string;
  //     }>;
  //   }) => {
  //     const {
  //       idTopic,
  //       idUser,
  //       status,
  //       timeStudy,
  //       score,
  //       correctQuestion,
  //       answers,
  //       idCourse,
  //     } = body;
  //     try {
  //       // get use
  //       const user = await UserModel.findOne({ _id: idUser });
  //       if (user && idCourse) {
  //         const userInfo = new UserInfo(user);
  //         // let newProgress = userInfo.progress

  //         const newProgress = { ...userInfo.progress };
  //         const courseProgress = newProgress[idCourse];

  //         if (courseProgress) {
  //           const progress = newProgress[idCourse].findIndex(
  //             (o) => o.idTopic == idTopic
  //           );
  //           if (progress !== undefined && progress !== -1) {
  //             newProgress[idCourse].splice(progress, 1);
  //           }
  //           newProgress[idCourse] = [
  //             ...(newProgress[idCourse] || []),
  //             {
  //               status,
  //               idTopic,
  //               timeStudy,
  //               score,
  //               correctQuestion,
  //               answers,
  //             },
  //           ];
  //         } else {
  //           newProgress[idCourse] = [
  //             {
  //               status,
  //               idTopic,
  //               timeStudy,
  //               score,
  //               correctQuestion,
  //               answers,
  //             },
  //           ];
  //         }

  //         const res = await UserModel.findOneAndUpdate(
  //           { _id: idUser },
  //           { $set: { progress: newProgress } },
  //           { new: true }
  //         );
  //         return {
  //           data: res,
  //           status: AppConfig.STATUS_SUCCESS,
  //         };
  //       } else {
  //         return {
  //           status: AppConfig.RESPONSIVE_NULL,
  //         };
  //       }
  //     } catch (error) {
  //       throw new BadRequestError();
  //     }
  //   };

  //   getTotalLearnedTopic = async (body: { idCourse: string; idUser: string }) => {
  //     const { idCourse, idUser } = body;
  //     try {
  //       const topics = await TopicModel.find({
  //         idCourse,
  //         status: AppConfig.STATUS_PUBLIC,
  //       });
  //       const user = await UserModel.findOne({ _id: idUser });
  //       const progress = { ...user?.progress }[idCourse];
  //       const res = topics.filter(
  //         (o1) =>
  //           progress &&
  //           progress.some(
  //             (o2) => o2.idTopic.toString() === o1._id.toString() && o1.type === 1
  //           )
  //       ).length;
  //       return {
  //         totalLearned: res,
  //         status: AppConfig.STATUS_SUCCESS,
  //       };
  //     } catch (error) {
  //       throw new BadRequestError();
  //     }
  //   };
}
