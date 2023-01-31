import {Request, Response, Router} from "express";
import {usersService} from "../../domain/users-service";
import {
    authMiddlewareBearer,
    inputUsersValidation,
    inputValidationErrors
} from "../../middlewares/input-validation-middleware";
import {sendStatus} from "../../repositories/status-collection";
import {jwtService} from "../../application/jwt-service";

export const authRouter = Router({})

authRouter.post("/login",
    inputUsersValidation.loginOrEmail,
    inputUsersValidation.password,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        const checkUser = await usersService.checkCredentials(loginOrEmail, password)
        if (!checkUser || typeof checkUser === "boolean") {
            res.sendStatus(sendStatus.UNAUTHORIZED_401)
            return
        }
        const token = await jwtService.createJWT(checkUser)
        res.status(sendStatus.OK_200).send({accessToken: token})
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
            userUd: req.user.id
        })
    }
)