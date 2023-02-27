import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {tryObjectId} from "../middlewares/input-validation-middleware";
import {blogsQueryRepository} from "./blogs-query-repository";
import {blogIdQueryMiddleware} from "../middlewares/input-validation-middleware";
import {allBlogsUIType, allPostsUIType, blogUIType} from "../db/UI-types";

export const blogsQueryRouter = Router()

blogsQueryRouter.get("/", async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const allBlogs: allBlogsUIType = await blogsQueryRepository
        .findAllBlogs(searchNameTerm as string, sortBy as string, sortDirection as string, pageNumber, pageSize)
    res.status(sendStatus.OK_200).send(allBlogs)
})

blogsQueryRouter.get("/:id", async (req: Request, res: Response) => {
    const blogId = tryObjectId(req.params.id)
    if (!blogId) return res.sendStatus(sendStatus.NOT_FOUND_404)
    const foundBlog: blogUIType | null = await blogsQueryRepository.findBlogById(blogId)
    if (!foundBlog) return res.sendStatus(sendStatus.NOT_FOUND_404)
    res.status(sendStatus.OK_200).send(foundBlog)

})

blogsQueryRouter.get("/:id/posts",
    blogIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const blogId = req.params.id
        const allPostsByBlogId: allPostsUIType | null = await blogsQueryRepository
            .findAllPostsByBlogId(blogId, sortBy as string, sortDirection as string, pageNumber, pageSize)
        res.status(sendStatus.OK_200).send(allPostsByBlogId)
    })


