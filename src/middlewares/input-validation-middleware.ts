import {NextFunction, Response, Request} from "express";
import {body, validationResult} from "express-validator";
import {sendStatus} from "../routes/send-status-collections";
import {blogsRepository} from "../repositories/blogs-repository";

export const inputBlogsValidation = {
    name: body('name').isString().trim().isLength({min: 1, max: 15}),
    description: body('description').isString().trim().isLength({min: 1, max: 500}),
    websiteUrl: body('websiteUrl').isString().isLength({min: 1, max: 100}).isURL()
}
export const inputPostsValidation =  {
    title: body('title').isString().trim().isLength({min: 1, max: 30}),
    shortDescription: body('shortDescription').isString().trim().isLength({min: 1, max: 100}),
    content: body('content').isString().trim().isLength({min: 1, max: 1000}),
    blogId: body('blogId')
        .isString().withMessage('Must be a string')
        .trim().withMessage('Can not be empty')
        .isLength({min: 1, max: 100}).withMessage('Length must be from 1 to 100 symbols')
        .custom(value => {
        if (!blogsRepository.findBlogById(value)) {
            throw new Error('Blog is not found');
        }
        return true;
    })
}
export const inputValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(sendStatus.BAD_REQUEST_400).json({errors: errors.array()})
        return
    } else {
        next()
    }
}