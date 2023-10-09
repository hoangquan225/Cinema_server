import { Router } from "express";
import { UserModel } from "../../database/users";
import { jwtDecodeToken, jwtEncode } from "../../utils/jwtToken";
import asyncHandler from '../../utils/asyncHandler';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { jwtMiddleware } from "./middleware";
import _ from "lodash";
import AppConfig from "../../common/config";
import { encodeSHA256Pass } from "../../utils/crypto";
import { UserInfo } from "../../models/user";

const router = Router();

router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body
    console.log("/login");
    
    const user = await UserModel.findOne({ email, status: AppConfig.STATUS_PUBLIC })
    if (!user) {
        return res.status(200).json({
            status: AppConfig.STATUS_FAIL,
            token: "-1" // không tồn tại
        })
    }

    const encodedPassword = encodeSHA256Pass(email, password);

    if (encodedPassword !== user.password) {
        return res.status(200).json({
            status: AppConfig.STATUS_FAIL,
            token: "1" // sai password
        })
    }
    const token = jwtEncode(user._id);
    await UserModel.findByIdAndUpdate(user._id, { $set: { lastLogin: Date.now() } })

    return res.json({
        status: AppConfig.STATUS_SUCCESS,
        token,
        userId: user._id
    })
}))

router.post("/session", jwtMiddleware, asyncHandler(async (req, res) => {
    console.log("/session");
    return res.status(200).json({})
}))

router.post("/register", asyncHandler(async (req, res) => {
    console.log("/register");
    const { password, email, phoneNumber, gender, name } = req.body as Partial<UserInfo> & { reTypePassword?: string }
    // const { password, email, phoneNumber, gender, reTypePassword, name } = req.body as Partial<UserInfo> & { reTypePassword?: string }
    if (!password || !email || !phoneNumber || !gender || !name) {
        return res.status(400).json("params is not valid")
    }
    // if (reTypePassword && reTypePassword !== password) return res.status(400).json("params is not valid")

    const isExistUser = await UserModel.exists({
        $or: [
            { email }
        ]
    })
    if (isExistUser) return res.status(200).json({
        status: AppConfig.LOGIN_ACCOUNT_IS_USED,
        token: null
    })
    const registerUser = await UserModel.create({
        ...req.body,
        password: encodeSHA256Pass(email, password),
        registerDate: Date.now()
    })
    const token = jwtEncode(registerUser._id);
    return res.json({
        status: AppConfig.STATUS_SUCCESS,
        token,
        userId: registerUser._id
    })
}))

router.post("/user", jwtMiddleware, asyncHandler(async (req, res) => {
    console.log("/user");
    const { _id } = req.body;
    const user = await UserModel.findOne({ _id });

    return res.json({data: user, status: 0})
}))

router.post("/update-user", asyncHandler(async (req, res) => {
    console.log("/update-user");
    const { _id, password, ...updateFeild } = req.body;
    let _password: string | null = "";
    const user = await UserModel.findOne({ _id })
    if (!user) return res.json({ status: AppConfig.STATUS_NO_EXIST })

    if (password) {
        _password = encodeSHA256Pass(user.email, password)
        if (!_password) return res.json({ status: AppConfig.STATUS_FAIL })
        Object.assign(updateFeild, { password: _password })
    }
    await UserModel.findOneAndUpdate(
        { _id },
        { $set: { ...updateFeild } },
    )
    return res.json({
        status: AppConfig.STATUS_SUCCESS
    })
}))

export { router as authRouter }