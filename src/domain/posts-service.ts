import {postsRepository} from "../repositories/posts-repositories/posts-command-repository";
import {blogsRepository} from "../repositories/blogs-repositories/blogs-command-repository";
import {ObjectId} from "mongodb";
import {postsType} from "../repositories/posts-repositories/posts-command-repository";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsType> {
        const postById = await blogsRepository.findBlogById(blogId)
        const newPost: postsType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: typeof postById !== "boolean" ? postById.id : "f",
            blogName: typeof postById !== "boolean" ? postById.name : "f",
            createdAt: new Date().toISOString()
        }
        const result = await postsRepository.createPost(newPost)
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
        return postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return postsRepository.deletePost(postId)
    },
    async deleteAllPosts(): Promise<boolean> {
        return postsRepository.deleteAllPosts()
    }
}