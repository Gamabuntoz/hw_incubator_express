import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {
    authMiddleware,
    inputUsersValidation,
    inputValidationErrors
} from "../middlewares/input-validation-middleware";
import {sendStatus} from "../repositories/status-collection";

export const authRouter = Router({})

authRouter.post("/login",
    authMiddleware,
    inputUsersValidation.loginOrEmail,
    inputUsersValidation.password,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const loginOrEmail = req.body.loginOrEmail
        const password = req.body.password
        const checkResult = await usersService.checkCredentials(loginOrEmail, password)
        if (!checkResult) {
               res.sendStatus(sendStatus.UNAUTHORIZED_401)
               return
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })