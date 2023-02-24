import {Request, Response, Router} from "express";
import {, , } from "../db/DB-types";
import {sendStatus} from "../db/status-collection";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "./blogs-query-repository";
import {blogIdQueryMiddleware} from "../middlewares/input-validation-middleware";

export const blogsQueryRouter = Router()

blogsQueryRouter.get("/", async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const allBlogs: findBlogsType = await blogsQueryRepository
        .findAllBlogs(searchNameTerm as string, sortBy as string, sortDirection as string, pageNumber, pageSize)
    res.status(sendStatus.OK_200).send(allBlogs)
})

blogsQueryRouter.get("/:id", async (req: Request, res: Response) => {
    let blogId: ObjectId;
    try {
        blogId = new ObjectId(req.params.id)
    } catch (e) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return false
    }

    const foundBlog: blogsType | null = await blogsQueryRepository.findBlogById(blogId)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }

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
        const allPostsByBlogId: findPostsType | null = await blogsQueryRepository
            .findAllPostsByBlogId(blogId, sortBy as string, sortDirection as string, pageNumber, pageSize)

        res.status(sendStatus.OK_200).send(allPostsByBlogId)
    })


