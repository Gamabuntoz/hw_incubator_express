import {NextFunction, Request, Response, Router} from "express";
import {blogsArrayType, blogsRepository, blogsType} from "../repositories/blogs-db-repository";
import {sendStatus} from "./send-status-collections";
import {
    authMiddleware,
    inputBlogsValidation,
    inputValidationErrors,
} from "../middlewares/input-validation-middleware";
export const blogsRouter = Router()

blogsRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs: blogsArrayType = await blogsRepository.findAllBlogs()
    res.status(sendStatus.OK_200).send(allBlogs)
})
blogsRouter.get('/:id',  async (req: Request, res: Response) => {
    const foundBlog: blogsType | undefined | null = await blogsRepository.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    res.status(sendStatus.OK_200).send(foundBlog)
})

blogsRouter.post('/',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const newBlogCreate: blogsType = await blogsRepository.createBlog(name, description, website)
           res.status(sendStatus.CREATED_201).send(newBlogCreate)
})
blogsRouter.put('/:id',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const updateBlog: boolean = await blogsRepository.updateBlog(id, name, description, website)
        if (!updateBlog) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
blogsRouter.delete('/:id',
    (req: Request, res: Response, next: NextFunction) => {
        authMiddleware(req, res, next)
    },
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const foundBlog: boolean = await blogsRepository.deleteBlog(req.params.id)
    if (!foundBlog) {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})

