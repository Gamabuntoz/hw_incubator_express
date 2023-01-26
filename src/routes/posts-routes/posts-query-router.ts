import {Request, Response, Router} from "express";
import {findPostsType, postsType} from "../../repositories/types/types";
import {sendStatus} from "../../repositories/status-collection";
import {postsQueryRepository} from "../../repositories/posts-repositories/posts-query-repository";
import {ObjectId} from "mongodb";

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