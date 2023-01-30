import {Request, Response, Router} from "express";
import {blogsType, findCommentsType, findPostsType, postsType} from "../../repositories/types/types";
import {sendStatus} from "../../repositories/status-collection";
import {postsQueryRepository} from "../../repositories/posts/posts-query-repository";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../../repositories/blogs/blogs-query-repository";
import {blogsQueryRouter} from "../blogs/blogs-query-router";
import {blogIdQueryMiddleware, postIdQueryMiddleware} from "../../middlewares/input-validation-middleware";

export const postsQueryRouter = Router()

postsQueryRouter.get('/', async (req: Request, res: Response) => {
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const allPosts: findPostsType = await postsQueryRepository
        .findAllPosts(sortBy as string, sortDirection as string, pageNumber, pageSize)
    res.status(sendStatus.OK_200).send(allPosts)
})
postsQueryRouter.get('/:id', async (req: Request, res: Response) => {
    let postId: ObjectId;
    try {
        postId = new ObjectId(req.params.id)
    } catch (e) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return false
    }
    const foundPost: postsType | null | boolean = await postsQueryRepository.findPostById(postId)
    if (!foundPost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})
postsQueryRouter.get('/:id/comments',
    postIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const postId = req.params.id
        const allCommentsByPostId: findCommentsType | null = await postsQueryRepository
            .findAllCommentsByPostId(sortBy as string, sortDirection as string, pageNumber, pageSize, postId)

        res.status(sendStatus.OK_200).send(allCommentsByPostId)
    })