import {Request, Response, Router} from "express";
import {inputUsersValidation, inputValidationErrors} from "../middlewares/input-validation-middleware";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service"
import {deviceAuthSessionsType} from "../db/types";
import {authService} from "./auth-service";
import {usersRepository} from "../users/users-repository";
import {v4 as uuidv4} from "uuid"
import {
    authAttemptsChecker,
    authCheckLoginOrEmail,
    authMiddlewareBearer,
    authRefreshTokenMiddleware
} from "../middlewares/authorization-middleware";
import {settings} from "../db/db";
import {ObjectId} from "mongodb"
import {devicesRepository} from "../devices/devices-repository";

export const authRouter = Router({})

authRouter.post("/registration",
    authCheckLoginOrEmail,
    inputUsersValidation.login,
    inputUsersValidation.password,
    inputUsersValidation.email,
    authAttemptsChecker,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const login = req.body.login
        const password = req.body.password
        const email = req.body.email
        await authService.createUser(login, password, email)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
authRouter.post("/registration-confirmation",
    authAttemptsChecker,
    async (req: Request, res: Response) => {
        const code = req.body.code
        const result = await authService.confirmEmail(code)
        if (typeof result === "string") {
            return res.status(sendStatus.BAD_REQUEST_400).send({
                errorsMessages: [
                    {
                        message: result,
                        field: "code"
                    }
                ]
            })
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })

authRouter.post("/registration-email-resending",
    inputUsersValidation.email,
    authAttemptsChecker,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const email = req.body.email
        const result = await authService.resendEmail(email)
        if (typeof result === "string") {
            return res.status(sendStatus.BAD_REQUEST_400).send({
                errorsMessages: [
                    {
                        message: result,
                        field: "email"
                    }
                ]
            })
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
authRouter.post("/refresh-token",
    authRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const oldRefreshToken = req.cookies.refreshToken
        const checkUserToken = await jwtService.checkRefreshToken(oldRefreshToken)
        const issueAt = new Date().getTime()
        const user = await usersRepository.findUserById(new ObjectId(checkUserToken!.userId))
        const accessToken = await jwtService.createAccessJWT(user!)
        const refreshToken = await jwtService.createRefreshJWT(user!, checkUserToken!.deviceId, issueAt)
        await devicesRepository.updateDeviceInfo(checkUserToken!.issueAt, issueAt)
        res.status(sendStatus.OK_200).cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true
        }).send({accessToken: accessToken})
    })
authRouter.post("/login",
    inputUsersValidation.loginOrEmail,
    inputUsersValidation.password,
    authAttemptsChecker,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        const checkUserToken = await authService.checkCredentials(loginOrEmail, password)
        if (!checkUserToken || typeof checkUserToken === "boolean") {
            res.sendStatus(sendStatus.UNAUTHORIZED_401)
            return
        }
        const userIpAddress = req.ip
        const userDeviceName = req.headers['user-agent']
        const device = {
            ipAddress: userIpAddress,
            deviceName: userDeviceName,
            deviceId: uuidv4(),
            issueAt: new Date().getTime(),
            expiresAt: new Date().getTime() + settings.EXPIRATION_JWT_REFRESH_TOKEN,
            userId: checkUserToken._id.toString()
        }
        const accessToken = await jwtService.createAccessJWT(checkUserToken)
        const refreshToken = await jwtService.createRefreshJWT(checkUserToken, device.deviceId, device.issueAt)
        await devicesRepository.insertDeviceInfo(device as deviceAuthSessionsType)
        res.cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true
        })
        res.status(sendStatus.OK_200).send({accessToken: accessToken})
    })
authRouter.post("/logout",
    authRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const oldRefreshToken = req.cookies.refreshToken
        const checkUserToken = await jwtService.checkRefreshToken(oldRefreshToken)
        await devicesRepository.deleteDevice(checkUserToken!.issueAt)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
authRouter.get("/me",
    authMiddlewareBearer,
    async (req: Request, res: Response) => {
        if (!req.user) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        res.status(sendStatus.OK_200).send({
            email: req.user.email,
            login: req.user.login,
            userId: req.user.id,
        })
    })
authRouter.post("/password-recovery",
    inputUsersValidation.email,
    authAttemptsChecker,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const email = req.body.email
        await authService.passwordRecovery(email)
        res.sendStatus(sendStatus.NO_CONTENT_204)
        return
    })
authRouter.post("/new-password",
    inputUsersValidation.password,
    authAttemptsChecker,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const newPassword = req.body.newPassword
        const recoveryCode = req.body.recoveryCode
        const result = await authService.changePasswordAttempt(newPassword, recoveryCode)
        if (!result) {
            res.sendStatus(sendStatus.BAD_REQUEST_400)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
        return
    })




