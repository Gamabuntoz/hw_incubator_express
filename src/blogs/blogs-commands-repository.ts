import {ObjectId} from "mongodb";
import {BlogModelClass} from "../db/db";
import {blogDBType} from "../db/DB-types";


export class BlogsCommandsRepository {
    async findBlogById(blogId: ObjectId): Promise<null | blogDBType> {
        return BlogModelClass.findOne({_id: blogId})
    }

    async createBlog(newBlog: blogDBType): Promise<blogDBType> {
        await BlogModelClass.create(newBlog)
        return newBlog
    }

    async updateBlog(postId: ObjectId, name: string, description: string, website: string): Promise<boolean> {
        const result = await BlogModelClass
            .updateOne({_id: postId}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    }

    async deleteBlog(postId: ObjectId): Promise<boolean> {
        const result = await BlogModelClass.deleteOne({_id: postId})
        return result.deletedCount === 1
    }
}

export const blogsCommandsRepository = new BlogsCommandsRepository()