import {Router} from "express";
import {
    blogIdQueryMiddleware,
    inputBlogsValidation,
    inputPostsValidation,
    inputValidationErrors,
} from "../middlewares/input-validation-middleware";
import {authMiddlewareBasic} from "../middlewares/authorization-middleware";
import {blogsCommandsController} from "../composition-root";

export const blogsCommandsRouter = Router()

blogsCommandsRouter.post("/",
    authMiddlewareBasic,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    blogsCommandsController.createBlog.bind(blogsCommandsController))

blogsCommandsRouter.post("/:id/posts",
    authMiddlewareBasic,
    blogIdQueryMiddleware,
    inputPostsValidation.title,
    inputPostsValidation.shortDescription,
    inputPostsValidation.content,
    inputValidationErrors,
    blogsCommandsController.createPostByBlogId.bind(blogsCommandsController))

blogsCommandsRouter.put("/:id",
    authMiddlewareBasic,
    inputBlogsValidation.name,
    inputBlogsValidation.description,
    inputBlogsValidation.websiteUrl,
    inputValidationErrors,
    blogsCommandsController.updateBlog.bind(blogsCommandsController))

blogsCommandsRouter.delete("/:id",
    authMiddlewareBasic,
    blogsCommandsController.deleteBlog.bind(blogsCommandsController))

