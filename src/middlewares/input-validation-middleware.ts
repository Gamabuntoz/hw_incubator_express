import {NextFunction, Request, Response} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {sendStatus} from "../repositories/status-collection";
import {blogsCommandsRepository} from "../repositories/blogs-repositories/blogs-commands-repository";
import {adminCollection} from "../repositories/db";
import {ObjectId} from "mongodb";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findUser = await adminCollection.findOne({loginPass: req.headers.authorization})
    if (!findUser) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
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

export const inputBlogsValidation = {
    name: body('name')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 1, max: 15}).withMessage('Length must be from 1 to 15 symbols'),
    description: body('description')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 1, max: 500}).withMessage('Length must be from 1 to 500 symbols'),
    websiteUrl: body('websiteUrl')
        .isURL().withMessage('Must be URL')
}
export const inputPostsValidation = {
    title: body('title')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 1, max: 30}).withMessage('Length must be from 1 to 30 symbols'),
    shortDescription: body('shortDescription')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 1, max: 100}).withMessage('Length must be from 1 to 100 symbols'),
    content: body('content')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 1, max: 1000}).withMessage('Length must be from 1 to 1000 symbols'),
    blogId: body('blogId')
        .custom(async value => {
            let blogId: ObjectId;
            try {
                blogId = new ObjectId(value)
            } catch (e) {
                throw new Error('Blog is not found');
            }
            const result = await blogsCommandsRepository.findBlogById(blogId)
            if (!result) {
                throw new Error('Blog is not found');
            } else {
                return true;
            }
        })
}
export const inputUsersValidation = {
    login: body('login')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 3, max: 10}).withMessage('Length must be from 3 to 10 symbols')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Incorrect symbols'),
    password: body('password')
        .isString().trim().withMessage('Must be a string')
        .isLength({min: 6, max: 20}).withMessage('Length must be from 6 to 20 symbols'),
    email: body('email')
        .isEmail().withMessage('Incorrect email'),
    loginOrEmail: body('loginOrEmail')
        .exists().withMessage('Can not be empty')
        .isString().trim().withMessage('Must be a string')
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