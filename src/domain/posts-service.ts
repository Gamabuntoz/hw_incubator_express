import {postsCommandsRepository} from "../repositories/posts-repositories/posts-commands-repository";
import {ObjectId} from "mongodb";
import {postsType} from "../repositories/types/types";
import {blogsService} from "./blogs-service";


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
            createdAt: new Date().toISOString()
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