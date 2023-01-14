import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {sendStatus} from "./send-status-collections";
import {
    authorizationValidation,
    inputPostsValidation,
    inputValidationErrors
} from "../middlewares/input-validation-middleware";
export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const allPosts = postsRepository.findAllPosts()
    res.status(sendStatus.OK_200).send(allPosts)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepository.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})

postsRouter.post('/',
    authorizationValidation,
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputPostsValidation.blogId,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost = postsRepository.createPost(title, shortDescription, content, blogId)
        res.status(sendStatus.CREATED_201).send(newPost)
})
postsRouter.put('/:id',
    authorizationValidation,
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputPostsValidation.blogId,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const id = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const updatePost = postsRepository.updatePost(id, title, shortDescription, content, blogId)
    if (updatePost === 'Not found') {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
postsRouter.delete('/:id',
    authorizationValidation,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const foundPost = postsRepository.deletePost(req.params.id)
    if (foundPost === 'Not found') {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})