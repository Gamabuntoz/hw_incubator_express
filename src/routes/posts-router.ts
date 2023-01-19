import {NextFunction, Request, Response, Router} from "express";
import {postsArrayType, postsRepository, postsType} from "../repositories/posts-db-repository";
import {sendStatus} from "./send-status-collections";
import {
    authMiddleware,
    inputPostsValidation,
    inputValidationErrors
} from "../middlewares/input-validation-middleware";
export const postsRouter = Router()

postsRouter.get('/', async (req: Request, res: Response) => {
    const allPosts: postsArrayType = await postsRepository.findAllPosts()
    res.status(sendStatus.OK_200).send(allPosts)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const foundPost: postsType | null = await postsRepository.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})

postsRouter.post('/',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputPostsValidation.blogId,
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const newPost: postsType = await postsRepository.createPost(title, shortDescription, content, blogId)
        res.status(sendStatus.CREATED_201).send(newPost)
})
postsRouter.put('/:id',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputPostsValidation.blogId,
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const id = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId
    const updatePost: boolean = await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    if (!updatePost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
postsRouter.delete('/:id',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const foundPost: boolean = await postsRepository.deletePost(req.params.id)
    if (!foundPost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})