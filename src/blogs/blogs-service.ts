import {blogsCommandsRepository} from "./blogs-commands-repository";
import {ObjectId} from "mongodb";
import {blogsType, postsType} from "../db/types";
import {blogsCollection} from "../db/db";
import {postsCommandsRepository} from "../posts/posts-commands-repository";


export const blogsService = {
    async findBlogById(blogId: ObjectId): Promise<null | blogsType> {
        return blogsCollection.findOne({_id: blogId})
    },
    async createBlog(name: string, description: string, website: string): Promise<blogsType> {
        const newBlog: blogsType = {
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            websiteUrl: website,
        }
        const result = await blogsCommandsRepository.createBlog(newBlog)
        return {
            id: result._id!.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt,
        }
    },
    async updateBlog(id: string, name: string, description: string, website: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return blogsCommandsRepository.updateBlog(postId, name, description, website)
    },
    async createPostById(title: string, shortDescription: string, content: string, blogId: string): Promise<postsType | boolean> {
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
    async deleteBlog(id: string): Promise<boolean> {
        let blogId: ObjectId;
        try {
            blogId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return blogsCommandsRepository.deleteBlog(blogId)
    },
    async deleteAllBlogs(): Promise<boolean> {
        return blogsCommandsRepository.deleteAllBlogs()
    }
}