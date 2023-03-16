import {BlogsService} from "./blogs-service";
import {Request, Response} from "express";
import {blogUIType, postUIType} from "../db/UI-types";
import {sendStatus} from "../db/status-collection";

export class BlogsCommandsController {
    constructor(protected blogsService: BlogsService) {}

    async createBlog(req: Request, res: Response) {
        const name = req.body.name
        const description = req.body.description
        const website = req.body.websiteUrl
        const newBlogCreate: blogUIType = await this.blogsService.createBlog(name, description, website)
        res.status(sendStatus.CREATED_201).send(newBlogCreate)
    }

    async createPostByBlogId(req: Request, res: Response) {
        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.params.id
        const newPost: postUIType | boolean = await this.blogsService.createPostById(title, shortDescription, content, blogId)
        res.status(sendStatus.CREATED_201).send(newPost)
    }

    async updateBlog(req: Request, res: Response) {
        const id = req.params.id
        const name = req.body.name
        const description = req.body.description
        const website = req.body.websiteUrl
        const updateBlog: boolean = await this.blogsService.updateBlog(id, name, description, website)
        if (!updateBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    }

    async deleteBlog(req: Request, res: Response) {
        const foundBlog = await this.blogsService.deleteBlog(req.params.id)
        if (!foundBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    }
}