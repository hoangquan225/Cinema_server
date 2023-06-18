import AppConfig from "../common/config";
import { decrypt, encodeSHA256Pass, encrypt } from "../utils/crypto";
import { jwtDecodeToken, jwtEncode } from "../utils/jwtToken";

class AuthServices {
  private processPass(userObject: { account: string; password: string }) {
    const decryptedResult = decrypt(userObject.password);
    const encodedPassword = encodeSHA256Pass(
      userObject.account,
      decryptedResult
    );
    return encodedPassword;
  }

  //   private createToken(user: UserInfo) {
  //     let userInfo = new UserInfo(user);
  //     userInfo.loginCode = AppConfig.LOGIN_SUCCESS;
  //     userInfo.token = jwtEncode(userInfo?._id, 60 * 60 * 24 * 30);
  //     return userInfo;
  //   }

//   login = async (body: {
//     account: string;
//     password: string;
//     userRole?: number;
//   }): Promise<UserInfo> => {
//     const passEncode = this.processPass(body);
//     let userInfo = new UserInfo({ ...body, password: body.password });
//     try {
//       const checkUserAcc: UserInfo | null = await UserModel.findOne(
//         typeof body.userRole === "number"
//           ? { account: userInfo.account, userRole: body.userRole }
//           : { account: userInfo.account }
//       );
//       if (checkUserAcc) {
//         if (passEncode === checkUserAcc.password) {
//           userInfo = new UserInfo(checkUserAcc);
//           userInfo.loginCode = AppConfig.LOGIN_SUCCESS;
//           userInfo.token = jwtEncode(userInfo?._id, 60 * 60 * 24 * 30);
//           // update lastLogin
//         } else {
//           userInfo.loginCode = AppConfig.LOGIN_WRONG_PASSWORD;
//         }
//       } else {
//         userInfo.loginCode = AppConfig.LOGIN_ACCOUNT_NOT_EXIST;
//       }
//       return userInfo;
//     } catch (error) {
//       userInfo.loginCode = AppConfig.LOGIN_FAILED;
//       return userInfo;
//     }
//   };

//   register = async (body: UserInfo): Promise<any> => {
//     let userInfo = new UserInfo(body);
//     try {
//       const account = userInfo.account?.trim().toLowerCase();
//       const password = userInfo.password;
//       const checkUserAcc: UserInfo | null = await UserModel.findOne({
//         account,
//       });
//       if (!checkUserAcc) {
//         const passEncode = this.processPass({ account, password });

//         // luu vao db
//         const newUserInfo = {
//           ...userInfo,
//           password: passEncode,
//           registerDate: Date.now(),
//           status: AppConfig.UserStatus.NORMAL,
//           lastLogin: Date.now(),
//         };
//         const newUser = await UserModel.create(newUserInfo);
//         return this.createToken(newUser);
//       }
//       return { ...userInfo, loginCode: AppConfig.LOGIN_ACCOUNT_IS_USED };
//     } catch (err) {
//       userInfo.loginCode = AppConfig.LOGIN_FAILED;
//     }
//   };

//   logout = async (body: { idUser: string }) => {
//     try {
//       const user = await UserModel.findOne({ _id: body.idUser });
//       let status = AppConfig.STATUS_FAIL;
//       if (user) {
//         const userInfo = new UserInfo(user);
//         const res = await UserModel.findOneAndUpdate(
//           { _id: body.idUser },
//           { $set: { lastLogin: moment().valueOf() } },
//           { new: true }
//         );
//         return { status: AppConfig.STATUS_SUCCESS };
//       }
//       return { status };
//     } catch (error) {
//       return { status: AppConfig.STATUS_FAIL };
//     }
//   };
}
export { AuthServices };
