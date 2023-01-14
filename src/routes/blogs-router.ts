import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {sendStatus} from "./send-status-collections";
import {inputBlogsValidation, inputValidationErrors,} from "../middlewares/input-validation-middleware";
export const blogsRouter = Router()

blogsRouter.get('/', (req: Request, res: Response) => {
    const allBlogs = blogsRepository.findAllBlogs()
    res.status(sendStatus.OK_200).send(allBlogs)
})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlog = blogsRepository.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    res.status(sendStatus.OK_200).send(foundBlog)
})




blogsRouter.post('/',
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const newBlogCreate = blogsRepository.createBlog(authorization, name, description, website)
    if (newBlogCreate) {
        res.status(sendStatus.CREATED_201).send(newBlogCreate)
        return
    }
    res.sendStatus(sendStatus.UNAUTHORIZED_401)
})
blogsRouter.put('/:id',
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const updateBlog = blogsRepository.updateBlog(authorization, id, name, description, website)
        if (!updateBlog) {
            res.sendStatus(sendStatus.UNAUTHORIZED_401)
            return
        }
        if (updateBlog === 'Not found') {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }

    res.sendStatus(sendStatus.NO_CONTENT_204)
})
blogsRouter.delete('/:id', (req: Request, res: Response) => {
    const authorization = req.headers.authorization
    const foundBlog = blogsRepository.deleteBlog(authorization, req.params.id)
    if (foundBlog === 'Not found') {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    if (!foundBlog) {
        res.sendStatus(sendStatus.UNAUTHORIZED_401)
        return
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})

