import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {sendStatus} from "./send-status-collections";
export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const allPosts = postsRepository.findPosts(+req.params.id)
    res.status(sendStatus.OK_200).send(allPosts)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepository.findPosts(+req.params.id)
    if (!foundPost) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})

postsRouter.post('/', (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = postsRepository.createPost(authorization, title, shortDescription, content, blogId)
    if (newPost) {
        res.status(sendStatus.CREATED_201).send(newPost)
        return
    }
    res.sendStatus(sendStatus.UNAUTHORIZED_401)
})
postsRouter.put('/:id', (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const id = +req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const updatePost = postsRepository.updatePost(authorization, id, title, shortDescription, content, blogId)
    if (updatePost === 'Not found') {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    if (!updatePost) {
        res.sendStatus(sendStatus.UNAUTHORIZED_401)
        return
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
postsRouter.delete('/:id', (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const foundPost = postsRepository.deletePost(authorization, +req.params.id)
    if (foundPost === 'Not found') {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    if (!foundPost) {
        res.sendStatus(sendStatus.UNAUTHORIZED_401)
        return
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})