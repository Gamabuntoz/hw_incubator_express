import {NextFunction, Request, Response} from "express";
import {adminCollection, usersCollection} from "../db/db";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../users/users-service";

export const authCheckLoginOrEmail = async (req: Request, res: Response, next: NextFunction) => {
    const findUserByEmail = await usersCollection.findOne({"accountData.email": req.body.email})
    const findUserByLogin = await usersCollection.findOne({"accountData.login": req.body.login})
    if (findUserByEmail) {
        return res.status(sendStatus.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Email already exist",
                        field: "email"
                    }
                ]
            }
        )
    }
    if (findUserByLogin) {
        return res.status(sendStatus.BAD_REQUEST_400).send(
            {
                errorsMessages: [
                    {
                        message: "Login already exist",
                        field: "login"
                    }
                ]
            }
        )
    }
    next()
}
export const authMiddlewareBasic = async (req: Request, res: Response, next: NextFunction) => {
    const findUser = await adminCollection.findOne({loginPass: req.headers.authorization})
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
    const userId = await jwtService.checkRefreshToken(token)
    if (!userId) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    req.user = await usersService.findUserById(userId.userId)
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
    const findDevice = jwtService.findDeviceByDate(checkUserToken.issueAt)
    if (!findDevice) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    next()
}
