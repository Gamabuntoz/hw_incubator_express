import {NextFunction, Request, Response} from "express";
import {AdminModelClass, AuthAttemptModelClass, UserModelClass} from "../db/db";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../users/users-service";
import {devicesRepository} from "../devices/devices-repository";
import {ObjectId} from "mongodb";

// export const authCheckLoginOrEmail = async (req: Request, res: Response, next: NextFunction) => {
//     const findUserByEmail = await UserModelClass.findOne({"accountData.email": req.body.email})
//     const findUserByLogin = await UserModelClass.findOne({"accountData.login": req.body.login})
//     if (findUserByEmail) {
//         return res.status(sendStatus.BAD_REQUEST_400).send(
//             {
//                 errorsMessages: [
//                     {
//                         message: "Email already exist",
//                         field: "email"
//                     }
//                 ]
//             }
//         )
//     }
//     if (findUserByLogin) {
//         return res.status(sendStatus.BAD_REQUEST_400).send(
//             {
//                 errorsMessages: [
//                     {
//                         message: "Login already exist",
//                         field: "login"
//                     }
//                 ]
//             }
//         )
//     }
//     next()
// }
export const authMiddlewareBasic = async (req: Request, res: Response, next: NextFunction) => {
    const findUser = await AdminModelClass.findOne({loginPass: req.headers.authorization})
    if (!findUser) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    next()
}
export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    const token = authHeader.split(" ")[1]
    const userInfo = await jwtService.checkRefreshToken(token)
    if (!userInfo) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    req.user = await usersService.findUserById(new ObjectId(userInfo.userId))
    next()
}
export const optionalAuthCheck = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return false
    const token = authHeader.split(" ")[1]
    const userInfo = await jwtService.checkRefreshToken(token)
    if (!userInfo) return false
    req.user = await usersService.findUserById(new ObjectId(userInfo.userId))
    next()
}
export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let oldRefreshToken
    try {
        oldRefreshToken = req.cookies.refreshToken
    } catch (e) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    const checkUserToken = await jwtService.checkRefreshToken(oldRefreshToken)
    if (!checkUserToken) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    const findDevice = await devicesRepository.findDeviceByDate(checkUserToken.issueAt)
    if (!findDevice) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    next()
}
export const authAttemptsChecker = async (req: Request, res: Response, next: NextFunction) => {
    const interval = 10 * 1000
    const ip = req.ip
    const currentTime = new Date()
    const url = req.url
    const attemptTime = new Date(currentTime.getTime() - interval)
    const attemptCount = await AuthAttemptModelClass.countDocuments({ip, url, time: {$gt: attemptTime}})
    await AuthAttemptModelClass.create({ip, url, time: currentTime})
    if (attemptCount < 5) {
        next()
    } else {
        res.sendStatus(sendStatus.TOO_MANY_REQUESTS_429)
        return
    }
}
export const deleteAttemptsDB = {
    async deleteAllAuthSessionAllUsers() {
        const result = await AuthAttemptModelClass.deleteMany({})
        return result.deletedCount === 1
    }
}