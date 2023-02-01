import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/db";
import {blogsType} from "../db/types";


export const blogsCommandsRepository = {
    async findBlogById(blogId: ObjectId): Promise<null | blogsType> {
        return blogsCollection.findOne({_id: blogId})
    },
    async createBlog(newBlog: blogsType): Promise<blogsType> {
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(postId: ObjectId, name: string, description: string, website: string): Promise<boolean> {
        const result = await blogsCollection
            .updateOne({_id: postId}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    },
    async deleteBlog(postId: ObjectId): Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}