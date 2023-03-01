import {NextFunction, Request, Response} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {sendStatus} from "../db/status-collection";
import {blogsCommandsRepository} from "../blogs/blogs-commands-repository";
import {ObjectId} from "mongodb";
import {postsCommandsRepository} from "../posts/posts-commands-repository";
import {commentsRepository} from "../comments/comments-repository";
import {usersRepository} from "../users/users-repository";

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
export const commentIdQueryMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let commentId: ObjectId;
    try {
        commentId = new ObjectId(req.params.id)
    } catch (e) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    const findBlog = await commentsRepository.findComment(commentId)
    if (!findBlog) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    next()
}
export const tryObjectId = (id: string) => {
    let newObjectId: ObjectId;
    try {
        newObjectId = new ObjectId(id)
        return newObjectId
    } catch (e) {
        console.log(e)
        return false
    }
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
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage("Incorrect symbols")
        .custom(async v => {
            const user = await usersRepository.findUserByLoginOrEmail(v)
            if (user) throw new Error("Login already exist")
            return true
        }),
    password: body("password")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 6, max: 20}).withMessage("Length must be from 6 to 20 symbols"),
    email: body("email")
        .isEmail().withMessage("Incorrect email")
        .custom(async v => {
            const user = await usersRepository.findUserByLoginOrEmail(v)
            if (user) throw new Error("Email already exist")
            return true
        }),
    loginOrEmail: body("loginOrEmail")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 3, max: 30}).withMessage("Length must be from 3 to 10 symbols"),
    newPassword: body("newPassword")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 6, max: 20}).withMessage("Length must be from 6 to 20 symbols")
}
export const inputCommentsValidation = {
    content: body("content")
        .isString().trim().withMessage("Must be a string")
        .isLength({min: 20, max: 300}).withMessage("Length must be from 1 to 15 symbols"),
    likeStatus: body("likeStatus")
        .custom(v => {
            if (v !== "None" || v !== "Like" || v !== "Dislike") throw new Error("Invalid data")
            return true
        }),
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