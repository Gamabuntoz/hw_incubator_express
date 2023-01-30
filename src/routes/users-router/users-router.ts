import {Request, Response, Router} from "express";
import {findUsersType, usersType} from "../../repositories/types/types";
import {sendStatus} from "../../repositories/status-collection";
import {
    authMiddleware,
    inputUsersValidation,
    inputValidationErrors
} from "../../middlewares/input-validation-middleware";
import {usersService} from "../../domain/users-service";

export const usersRouter = Router()

usersRouter.get('/', async (req: Request, res: Response) => {
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const searchLoginTerm = req.query.searchLoginTerm
    const searchEmailTerm = req.query.searchEmailTerm
    const allUsers: findUsersType = await usersService
        .findAllUsers(sortBy as string, sortDirection as string, pageNumber, pageSize, searchLoginTerm as string, searchEmailTerm as string)
    res.status(sendStatus.OK_200).send(allUsers)
})
usersRouter.post('/',
    authMiddleware,
    inputUsersValidation.login,
    inputUsersValidation.password,
    inputUsersValidation.email,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const login = req.body.login
        const password = req.body.password
        const email = req.body.email
        const newUser: usersType | boolean | null = await usersService.createUser(login, password, email)
        res.status(sendStatus.CREATED_201).send(newUser)
    })
usersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const foundUser = await usersService.deleteUser(req.params.id)
        if (!foundUser) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })