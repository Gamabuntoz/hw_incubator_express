import {NextFunction, Request, Response} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {sendStatus} from "../db/status-collection";
import {blogsCommandsRepository} from "../blogs/blogs-commands-repository";
import {adminCollection, usersCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../users/users-service";
import {postsCommandsRepository} from "../posts/posts-commands-repository";

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
    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    req.user = await usersService.findUserById(userId)
    next()
}
export const blogIdQueryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let blogId: ObjectId;
    try {
        blogId = new ObjectId(req.params.id)
    } catch (e) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    const findBlog = await blogsCommandsRepository.findBlogById(blogId)
    if (!findBlog) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    next()
}
export const postIdQueryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let postId: ObjectId;
    try {
        postId = new ObjectId(req.params.id)
    } catch (e) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    const findBlog = await postsCommandsRepository.findPostById(postId.toString())
    if (!findBlog) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    next()
}


export const inputBlogsValidation = {
    name: body("name")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 1, max: 15}).withMessage("Length must be from 1 to 15 symbols"),
    description: body("description")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 1, max: 500}).withMessage("Length must be from 1 to 500 symbols"),
    websiteUrl: body("websiteUrl")
        .isURL().withMessage("Must be URL")
        .isLength({min: 1, max: 100}).withMessage("Length must be from 1 to 500 symbols")
}
export const inputPostsValidation = {
    title: body("title")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 1, max: 30}).withMessage("Length must be from 1 to 30 symbols"),
    shortDescription: body("shortDescription")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 1, max: 100}).withMessage("Length must be from 1 to 100 symbols"),
    content: body("content")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 1, max: 1000}).withMessage("Length must be from 1 to 1000 symbols"),
    blogId: body("blogId")
        .custom(async value => {
            let blogId: ObjectId;
            try {
                blogId = new ObjectId(value)
            } catch (e) {
                throw new Error("Blog is not found");
            }
            const result = await blogsCommandsRepository.findBlogById(blogId)
            if (!result) {
                throw new Error("Blog is not found");
            } else {
                return true;
            }
        })
}
export const inputUsersValidation = {
    login: body("login")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 3, max: 10}).withMessage("Length must be from 3 to 10 symbols")
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage("Incorrect symbols"),
    password: body("password")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 6, max: 20}).withMessage("Length must be from 6 to 20 symbols"),
    email: body("email")
        .isEmail().withMessage("Incorrect email"),
    loginOrEmail: body("loginOrEmail")
        .exists().withMessage("Can not be empty")
        .isString().trim().withMessage("Must be a string")
}
export const inputCommentsValidation = {
    content: body("content")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 20, max: 300}).withMessage("Length must be from 1 to 15 symbols"),
    }
export const inputValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errorFormat = ({msg, param}: ValidationError) => {
        return {message: msg, field: param}
    }
    const errors = validationResult(req).formatWith(errorFormat)
    if (!errors.isEmpty()) {
        res.status(sendStatus.BAD_REQUEST_400)
            .json({errorsMessages: errors.array({onlyFirstError: true})})
        return
    } else {
        next()
    }
}