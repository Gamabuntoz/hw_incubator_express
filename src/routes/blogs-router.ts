import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {sendStatus} from "./send-status-collections";
import {
    authorizationValidation,
    inputBlogsValidation,
    inputValidationErrors,
} from "../middlewares/input-validation-middleware";
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
    authorizationValidation,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const newBlogCreate = blogsRepository.createBlog(name, description, website)
           res.status(sendStatus.CREATED_201).send(newBlogCreate)
})
blogsRouter.put('/:id',
    authorizationValidation,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    (req: Request, res: Response) => {
    const id = req.params.id
    const name = req.body.name
    const description = req.body.description
    const website = req.body.websiteUrl
    const updateBlog = blogsRepository.updateBlog(id, name, description, website)
        if (updateBlog === 'Not found') {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})
blogsRouter.delete('/:id',
    authorizationValidation,
    (req: Request, res: Response) => {
    const foundBlog = blogsRepository.deleteBlog(req.params.id)
    if (foundBlog === 'Not found') {
        return res.sendStatus(sendStatus.NOT_FOUND_404)
    }
    res.sendStatus(sendStatus.NO_CONTENT_204)
})

