import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {
    inputUsersValidation,
    inputValidationErrors,
} from "../middlewares/input-validation-middleware";
import {usersService} from "./users-service";
import {authService} from "../auth/auth-service";
import {authMiddlewareBasic} from "../middlewares/authorization-middleware";
import {allUsersUIType, userUIType} from "../db/UI-types";

export const usersRouter = Router()

usersRouter.get("/",
    authMiddlewareBasic,
    async (req: Request, res: Response) => {
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const searchLoginTerm = req.query.searchLoginTerm
        const searchEmailTerm = req.query.searchEmailTerm
        const allUsers: allUsersUIType = await usersService
            .findAllUsers(sortBy as string, sortDirection as string, pageNumber, pageSize, searchLoginTerm as string, searchEmailTerm as string)
        res.status(sendStatus.OK_200).send(allUsers)
    })
usersRouter.post("/",
    authMiddlewareBasic,
    inputUsersValidation.login,
    inputUsersValidation.password,
    inputUsersValidation.email,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const login = req.body.login
        const password = req.body.password
        const email = req.body.email
        const newUser: userUIType | null = await authService.createUserByAdmin(login, password, email)
        res.status(sendStatus.CREATED_201).send(newUser)
    })
usersRouter.delete("/:id",
    authMiddlewareBasic,
    async (req: Request, res: Response) => {
        const foundUser = await usersService.deleteUser(req.params.id)
        if (!foundUser) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })