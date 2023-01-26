import {NextFunction, Request, Response} from "express";
import {body, param, ValidationError, validationResult} from "express-validator";
import {sendStatus} from "../repositories/status-collection";
import {blogsCommandsRepository} from "../repositories/blogs-repositories/blogs-commands-repository";
import {usersCollection} from "../repositories/users-repository";
import {ObjectId} from "mongodb";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findUser = await usersCollection.findOne({loginPass: req.headers.authorization})
    if (!findUser) {
        return res.sendStatus(sendStatus.UNAUTHORIZED_401)
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
        }),
    blogIdQuery: param('id')
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
export const inputValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errorFormat = ({msg, param}: ValidationError) => {
        return {message: msg, field: param}
    }
    const errors = validationResult(req).formatWith(errorFormat)
    if (!errors.isEmpty()) {
        res.status(sendStatus.BAD_REQUEST_400)
            .json({errorsMessages: errors.array()})
        return
    } else {
        next()
    }
}