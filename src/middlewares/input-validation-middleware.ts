import {NextFunction, Response, Request} from "express";
import {body, validationResult, ValidationError} from "express-validator";
import {sendStatus} from "../routes/send-status-collections";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {usersCollection} from "../repositories/users-db-repository";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const findUser = await usersCollection.findOne({loginPass: req.headers.authorization})
    if (!findUser) {
       return res.sendStatus(sendStatus.UNAUTHORIZED_401)
    }
    next()
}

export const inputBlogsValidation = {
    name: body('name')
        .trim().isString().withMessage('Must be a string')
        .isLength({min: 1, max: 15}).withMessage('Length must be from 1 to 15 symbols'),
    description: body('description')
        .trim().isString().withMessage('Must be a string')
        .isLength({min: 1, max: 500}).withMessage('Length must be from 1 to 500 symbols'),
    websiteUrl: body('websiteUrl')
        .isURL().withMessage('Must be URL')
}
export const inputPostsValidation = {
    title: body('title')
        .trim().isString().withMessage('Must be a string')
        .isLength({min: 1, max: 30}).withMessage('Length must be from 1 to 30 symbols'),
    shortDescription: body('shortDescription')
        .trim().isString().withMessage('Must be a string')
        .isLength({min: 1, max: 100}).withMessage('Length must be from 1 to 100 symbols'),
    content: body('content')
        .trim().isString().withMessage('Must be a string')
        .isLength({min: 1, max: 1000}).withMessage('Length must be from 1 to 1000 symbols'),
    blogId: body('blogId')
        .trim().isString().withMessage('Must be a string')
        .custom (value => {
            const result = blogsRepository.findBlogById(value)
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