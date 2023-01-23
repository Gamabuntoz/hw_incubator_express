import {Request, Response, Router} from "express";
import {postsArrayType, postsRepository, postsType} from "../../repositories/posts-repositories/posts-command-repository";
import {sendStatus} from "../send-status-collection";
import {
    authMiddleware,
    inputPostsValidation,
    inputValidationErrors
} from "../../middlewares/input-validation-middleware";
import {postsService} from "../../domain/posts-service";

export const postsCommandRouter = Router()

postsCommandRouter.get('/', async (req: Request, res: Response) => {
    const allPosts: postsArrayType = await postsRepository.findAllPosts()
    res.status(sendStatus.OK_200).send(allPosts)
})
postsCommandRouter.get('/:id', async (req: Request, res: Response) => {
    const foundPost: postsType | null | boolean = await postsRepository.findPostById(req.params.id)
    if (!foundPost) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.status(sendStatus.OK_200).send(foundPost)
})

postsCommandRouter.post('/',
    authMiddleware,
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
        const newPost: postsType = await postsService.createPost(title, shortDescription, content, blogId)
        res.status(sendStatus.CREATED_201).send(newPost)
    })
postsCommandRouter.put('/:id',
    authMiddleware,
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
        const updatePost: boolean = await postsService.updatePost(id, title, shortDescription, content, blogId)
        if (!updatePost) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
postsCommandRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const foundPost = await postsService.deletePost(req.params.id)
        if (!foundPost) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })