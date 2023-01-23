import {client} from "../db";
import {ObjectId} from "mongodb";

export type blogsType = {
    createdAt: string
    name: string
    description: string
    websiteUrl: string
    id?: string
    _id?: ObjectId
}
export type blogsArrayType = Array<blogsType>

const blogsCollection = client.db().collection<blogsType>("blogs-routes")


export const blogsRepository = {
    async findAllBlogs(): Promise<blogsArrayType> {
        const result = await blogsCollection.find({}).toArray()
        return result.map(b => ({
                id: b._id!.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt
            })
        )
    },
    async findBlogById(postId: ObjectId): Promise<null | blogsType> {
        return blogsCollection.findOne({_id: postId})
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