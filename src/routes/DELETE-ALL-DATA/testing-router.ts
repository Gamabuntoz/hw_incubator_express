import {Request, Response, Router} from "express";
import {postsService} from "../../domain/posts-service"
import {blogsService} from "../../domain/blogs-service";
import {usersService} from "../../domain/users-service";
import {commentsService} from "../../domain/comments-service";

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await postsService.deleteAllPosts()
    await blogsService.deleteAllBlogs()
    await usersService.deleteAllUsers()
    await commentsService.deleteAllComments()
    res.sendStatus(204)
})