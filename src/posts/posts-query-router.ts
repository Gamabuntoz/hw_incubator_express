import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {postsQueryRepository} from "./posts-query-repository";
import {postIdQueryMiddleware, tryObjectId} from "../middlewares/input-validation-middleware";
import {allCommentsUIType, allPostsUIType, postUIType} from "../db/UI-types";
import {optionalAuthCheck} from "../middlewares/authorization-middleware";

export const postsQueryRouter = Router()

postsQueryRouter.get("/",
    optionalAuthCheck,
    async (req: Request, res: Response) => {
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const allPosts: allPostsUIType = await postsQueryRepository
        .findAllPosts(sortBy as string, sortDirection as string, pageNumber, pageSize, req.user?.id)
    res.status(sendStatus.OK_200).send(allPosts)
})
postsQueryRouter.get("/:id",
    optionalAuthCheck,
    async (req: Request, res: Response) => {
    const postId = tryObjectId(req.params.id)
    if (!postId) return res.sendStatus(sendStatus.NOT_FOUND_404)
    const foundPost: postUIType | boolean = await postsQueryRepository.findPostById(postId, req.user?.id)
    if (!foundPost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})
postsQueryRouter.get("/:id/comments",
    optionalAuthCheck,
    postIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const sortBy = req.query.sortBy
        const sortDirection = req.query.sortDirection
        const pageNumber = +(req.query.pageNumber ?? 1)
        const pageSize = +(req.query.pageSize ?? 10)
        const postId = req.params.id
        const allCommentsByPostId: allCommentsUIType = await postsQueryRepository
            .findAllCommentsByPostId(sortBy as string, sortDirection as string, pageNumber, pageSize, postId, req.user?.id)
        res.status(sendStatus.OK_200).send(allCommentsByPostId)
    })