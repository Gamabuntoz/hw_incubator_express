import {Request, Response, Router} from "express";
import {blogsType} from "../../repositories/blogs-repositories/blogs-command-repository";
import {sendStatus} from "../send-status-collection";
import {
    authMiddleware,
    inputBlogsValidation,
    inputValidationErrors,
} from "../../middlewares/input-validation-middleware";
import {blogsService} from "../../domain/blogs-service";

export const blogsCommandRouter = Router()

blogsCommandRouter.post('/',
    authMiddleware,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const name = req.body.name
        const description = req.body.description
        const website = req.body.websiteUrl
        const newBlogCreate: blogsType = await blogsService.createBlog(name, description, website)
        res.status(sendStatus.CREATED_201).send(newBlogCreate)
    })
blogsCommandRouter.put('/:id',
    authMiddleware,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const id = req.params.id
        const name = req.body.name
        const description = req.body.description
        const website = req.body.websiteUrl
        const updateBlog: boolean = await blogsService.updateBlog(id, name, description, website)
        if (!updateBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
blogsCommandRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const foundBlog = await blogsService.deleteBlog(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })

