import {ObjectId} from "mongodb";
import {BlogModel} from "../db/db";
import {blogDBType} from "../db/DB-types";


export const blogsCommandsRepository = {
    async findBlogById(blogId: ObjectId): Promise<null | blogDBType> {
        return BlogModel.findOne({_id: blogId})
    },
    async createBlog(newBlog: blogDBType): Promise<blogDBType> {
        await BlogModel.create(newBlog)
        return newBlog
    },
    async updateBlog(postId: ObjectId, name: string, description: string, website: string): Promise<boolean> {
        const result = await BlogModel
            .updateOne({_id: postId}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    },
    async deleteBlog(postId: ObjectId): Promise<boolean> {
        const result = await BlogModel.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean> {
        const result = await BlogModel.deleteMany({})
        return result.deletedCount === 1
    }
}