import {Request, Response, Router} from "express";
import {postsService} from "../posts/posts-service"
import {blogsService} from "../blogs/blogs-service";
import {usersService} from "../users/users-service";
import {commentsService} from "../comments/comments-service";
import {jwtService} from "../application/jwt-service";

export const testingRouter = Router()

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await postsService.deleteAllPosts()
    await blogsService.deleteAllBlogs()
    await usersService.deleteAllUsers()
    await commentsService.deleteAllComments()
    await jwtService.deleteAllAuthSessionAllUsers()
    res.sendStatus(204)
})