import {Request, Response, Router} from "express";
import {blogDBType, postDBType} from "../db/DB-types";
import {sendStatus} from "../db/status-collection";
import {
    blogIdQueryMiddleware,
    inputBlogsValidation,
    inputPostsValidation,
    inputValidationErrors,
} from "../middlewares/input-validation-middleware";
import {blogsService} from "./blogs-service";
import {authMiddlewareBasic} from "../middlewares/authorization-middleware";
import {blogUIType} from "../db/UI-types";

export const blogsCommandsRouter = Router()

blogsCommandsRouter.post("/",
    authMiddlewareBasic,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const name = req.body.name
        const description = req.body.description
        const website = req.body.websiteUrl
        const newBlogCreate: blogUIType = await blogsService.createBlog(name, description, website)
        res.status(sendStatus.CREATED_201).send(newBlogCreate)
    })
blogsCommandsRouter.post("/:id/posts",
    authMiddlewareBasic,
    blogIdQueryMiddleware,
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputValidationErrors,
    async (req: Request, res: Response) => {
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.params.id
        const newPost: postDBType | boolean = await blogsService.createPostById(title, shortDescription, content, blogId)
        res.status(sendStatus.CREATED_201).send(newPost)
    })
blogsCommandsRouter.put("/:id",
    authMiddlewareBasic,
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
blogsCommandsRouter.delete("/:id",
    authMiddlewareBasic,
    async (req: Request, res: Response) => {
        const foundBlog = await blogsService.deleteBlog(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })

