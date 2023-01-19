import {Request, Response, Router} from "express";
import {postsRepository} from '../repositories/posts-in-memory-repository'
import {blogsRepository} from '../repositories/blogs-in-memory-repository'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    postsRepository.deleteAllPosts()
    blogsRepository.deleteAllBlogs()
        res.sendStatus(204)
})