import {Request, Response, Router} from "express";
import {
    AuthAttemptModelClass,
    BlogModelClass,
    CommentLikesModelClass,
    CommentModelClass,
    DeviceModelClass, PostLikesModelClass,
    PostModelClass,
    UserModelClass
} from "../db/db";

export const testingRouter = Router()

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await PostModelClass.deleteMany({})
    await BlogModelClass.deleteMany({})
    await UserModelClass.deleteMany({})
    await CommentModelClass.deleteMany({})
    await DeviceModelClass.deleteMany({})
    await AuthAttemptModelClass.deleteMany({})
    await CommentLikesModelClass.deleteMany({})
    await PostLikesModelClass.deleteMany({})
    res.sendStatus(204)
})