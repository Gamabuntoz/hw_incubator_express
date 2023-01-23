import {Request, Response, Router} from "express";
import {blogsArrayType, blogsRepository, blogsType} from "../../repositories/blogs-repositories/blogs-command-repository";
import {sendStatus} from "../send-status-collection";
import {ObjectId} from "mongodb";

export const blogsQueryRouter = Router()

blogsQueryRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs: blogsArrayType = await blogsRepository.findAllBlogs()

    res.status(sendStatus.OK_200).send(allBlogs)
})


blogsQueryRouter.get('/:id/posts', async (req: Request, res: Response) => {
    let postId: ObjectId;
    try {
        postId = new ObjectId(req.params.id)
    } catch (e) {
        console.log(e)
        return false
    }
    const foundBlog: blogsType | boolean | null = await blogsRepository.findBlogById(postId)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    res.status(sendStatus.OK_200).send(foundBlog)
})


blogsQueryRouter.get('/:id', async (req: Request, res: Response) => {
    let postId: ObjectId;
    try {
        postId = new ObjectId(req.params.id)
    } catch (e) {
        console.log(e)
        return false
    }
    const foundBlog: blogsType | null = await blogsRepository.findBlogById(postId)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    const result = {
        id: foundBlog._id!.toString(),
        name: foundBlog.name,
        description: foundBlog.description,
        websiteUrl: foundBlog.websiteUrl,
        createdAt: foundBlog.createdAt
    }
    res.status(sendStatus.OK_200).send(result)

})