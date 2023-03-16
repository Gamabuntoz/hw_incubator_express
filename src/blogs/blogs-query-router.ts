import {Router} from "express";
import {blogIdQueryMiddleware} from "../middlewares/input-validation-middleware";
import {optionalAuthCheck} from "../middlewares/authorization-middleware";
import {blogsQueryController} from "../composition-root";

export const blogsQueryRouter = Router()

blogsQueryRouter.get("/", blogsQueryController.getAllBlogs.bind(blogsQueryController))

blogsQueryRouter.get("/:id", blogsQueryController.getBlogById.bind(blogsQueryController))

blogsQueryRouter.get("/:id/posts",
    blogIdQueryMiddleware,
    optionalAuthCheck,
    blogsQueryController.getPostByBlogId.bind(blogsQueryController))


