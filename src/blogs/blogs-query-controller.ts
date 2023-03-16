import {BlogsQueryRepository} from "./blogs-query-repository";
import {Request, Response} from "express";
import {allBlogsUIType, allPostsUIType, blogUIType} from "../db/UI-types";
import {sendStatus} from "../db/status-collection";
import {tryObjectId} from "../middlewares/input-validation-middleware";

export class BlogsQueryController {
    constructor(protected blogsQueryRepository: BlogsQueryRepository) {}

    async getAllBlogs(req: Request, res: Response) {
        const searchNameTerm = req.query.searchNameTerm
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const allBlogs: allBlogsUIType = await this.blogsQueryRepository
            .findAllBlogs(searchNameTerm as string, sortBy as string, sortDirection as string, pageNumber, pageSize)
        res.status(sendStatus.OK_200).send(allBlogs)
    }

    async getBlogById(req: Request, res: Response) {
        const blogId = tryObjectId(req.params.id)
        if (!blogId) return res.sendStatus(sendStatus.NOT_FOUND_404)
        const foundBlog: blogUIType | null = await this.blogsQueryRepository.findBlogById(blogId)
        if (!foundBlog) return res.sendStatus(sendStatus.NOT_FOUND_404)
        res.status(sendStatus.OK_200).send(foundBlog)
    }

    async getPostByBlogId(req: Request, res: Response) {
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const blogId = req.params.id
        const allPostsByBlogId: allPostsUIType | null = await this.blogsQueryRepository
            .findAllPostsByBlogId(blogId, sortBy as string, sortDirection as string, pageNumber, pageSize, req.user?.id)
        res.status(sendStatus.OK_200).send(allPostsByBlogId)
    }
}