import {Request, Response, Router} from "express";
import {postsService} from "../domain/posts-service"
import {blogsService} from "../domain/blogs-service";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsService.deleteAllPosts()
    await blogsService.deleteAllBlogs()
    res.sendStatus(204)
})