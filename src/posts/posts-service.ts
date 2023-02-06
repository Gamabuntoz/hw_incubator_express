import {postsCommandsRepository} from "./posts-commands-repository";
import {ObjectId} from "mongodb";
import {commentsType, findUserType, postsType, userType} from "../db/types";
import {blogsService} from "../blogs/blogs-service";
import {commentsRepository} from "../comments/comments-repository";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsType | boolean> {
        const blogById = await blogsService.findBlogById(new ObjectId(blogId))
        if (!blogById) return false
        const newPost: postsType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogById.name,
            createdAt: new Date().toISOString(),
        }
        const result = await postsCommandsRepository.createPost(newPost)
        return {
            id: result._id!.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
        }
    },
    async createCommentByPostId(content: string, user: findUserType | null, postId: string): Promise<commentsType> {
        const newComment: commentsType = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: user!.id,
                userLogin: user!.login
            },
            createdAt: new Date().toISOString()
        }
        const result = await commentsRepository.createComment(newComment)
        return {
            id: newComment._id!.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return postsCommandsRepository.updatePost(postId, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return postsCommandsRepository.deletePost(postId)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsCommandsRepository.deleteAllPosts()
    }
}