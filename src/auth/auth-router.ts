import {Request, Response, Router} from "express";
import {
    authCheckLoginOrEmail,
    authMiddlewareBearer,
    inputUsersValidation,
    inputValidationErrors
} from "../middlewares/input-validation-middleware";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service"
import {userType} from "../db/types";
import {authService} from "./auth-service";
import {usersRepository} from "../users/users-repository";

export const authRouter = Router({})

authRouter.post("/registration",
    authCheckLoginOrEmail,
    inputUsersValidation.login,
    inputUsersValidation.password,
    inputUsersValidation.email,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const login = req.body.login
        const password = req.body.password
        const email = req.body.email
        const newUser: userType | boolean | null = await authService.createUser(login, password, email)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
authRouter.post("/registration-confirmation",
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
    async (req: Request, res: Response) => {
        let oldRefreshToken
        try {
            oldRefreshToken = req.cookies.refreshToken
        } catch (e) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const userIDbyRefreshToken = await jwtService.checkRefreshToken(oldRefreshToken)
        await jwtService.blockOldRefreshToken(oldRefreshToken)
        if (!userIDbyRefreshToken) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const user = await usersRepository.findUserById(userIDbyRefreshToken)
        const accessToken = await jwtService.createAccessJWT(user!)
        const refreshToken = await jwtService.createRefreshJWT(user!)
        res.status(sendStatus.OK_200).cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true
        }).send({accessToken: accessToken})
    })
authRouter.post("/logout",
    async (req: Request, res: Response) => {
        let oldRefreshToken
        try {
            oldRefreshToken = req.cookies.refreshToken
        } catch (e) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const userIDbyRefreshToken = await jwtService.checkRefreshToken(oldRefreshToken)
        await jwtService.blockOldRefreshToken(oldRefreshToken)
        if (!userIDbyRefreshToken) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        res.sendStatus(sendStatus.OK_200)
    })
authRouter.post("/login",
    inputUsersValidation.loginOrEmail,
    inputUsersValidation.password,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        const checkUser = await authService.checkCredentials(loginOrEmail, password)
        if (!checkUser || typeof checkUser === "boolean") {
            res.sendStatus(sendStatus.UNAUTHORIZED_401)
            return
        }
        const accessToken = await jwtService.createAccessJWT(checkUser)
        const refreshToken = await jwtService.createRefreshJWT(checkUser)
        res.status(sendStatus.OK_200).cookie("refreshToken", refreshToken, {
            secure: true,
            httpOnly: true
        }).send({accessToken: accessToken})
    })
authRouter.get("/me",
    authMiddlewareBearer,
    async (req: Request, res: Response) => {
        if (!req.user || typeof req.user === "boolean") {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        res.status(sendStatus.OK_200).send({
            email: req.user.email,
            login: req.user.login,
            userId: req.user.id,
        })
    }
)

