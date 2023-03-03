import {blogsCommandsRepository} from "./blogs-commands-repository";
import {ObjectId} from "mongodb";
import {blogDBType, postDBType} from "../db/DB-types";
import {BlogModelClass} from "../db/db";
import {postsCommandsRepository} from "../posts/posts-commands-repository";
import {blogUIType, postUIType} from "../db/UI-types";
import {tryObjectId} from "../middlewares/input-validation-middleware";


export const blogsService = {
    async findBlogById(blogId: ObjectId): Promise<null | blogDBType> {
        return BlogModelClass.findOne({_id: blogId})
    },
    async createBlog(name: string, description: string, website: string): Promise<blogUIType> {
        const newBlog: blogDBType = {
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            websiteUrl: website,
            isMembership: false
        }
        await blogsCommandsRepository.createBlog(newBlog)
        return {
            id: newBlog._id!.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    async updateBlog(id: string, name: string, description: string, website: string): Promise<boolean> {
        const postId = tryObjectId(id)
        if (!postId) return false
        const result = await blogsCommandsRepository.updateBlog(postId, name, description, website)
        return result
    },
    async createPostById(title: string, shortDescription: string, content: string, id: string): Promise<postUIType | boolean> {
        const blogId = tryObjectId(id)
        if (!blogId) return false
        const blogById = await blogsService.findBlogById(blogId)
        if (!blogById) return false
        const newPost: postDBType = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId.toString(),
            blogName: blogById.name,
            createdAt: new Date().toISOString()
        }
        await postsCommandsRepository.createPost(newPost)
        return {
            id: newPost._id!.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const blogId = tryObjectId(id)
        if (!blogId) return false
        return blogsCommandsRepository.deleteBlog(blogId)
    }
}