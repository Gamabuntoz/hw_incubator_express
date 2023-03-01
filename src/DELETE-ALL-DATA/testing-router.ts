import {Request, Response, Router} from "express";
import {postsService} from "../posts/posts-service"
import {blogsService} from "../blogs/blogs-service";
import {usersService} from "../users/users-service";
import {deleteAttemptsDB} from "../middlewares/authorization-middleware";
import {devicesRepository} from "../devices/devices-repository"
import {commentsRepository} from "../comments/comments-repository";

export const testingRouter = Router()

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await postsService.deleteAllPosts()
    await blogsService.deleteAllBlogs()
    await usersService.deleteAllUsers()
    await commentsRepository.deleteAllComments()
    await devicesRepository.deleteAllDevicesInfo()
    await deleteAttemptsDB.deleteAllAuthAttempt()
    await commentsRepository.deleteAllCommentsLikes()
    res.sendStatus(204)
})