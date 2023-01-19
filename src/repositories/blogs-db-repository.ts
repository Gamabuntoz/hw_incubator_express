import {client} from "./db";
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
let blogsArray: blogsArrayType = []

const blogsCollection = client.db().collection<blogsType>("blogs")

export const blogsRepository = {
    async findAllBlogs():Promise<blogsArrayType> {
        return await blogsCollection.find({}).toArray()
    },
    async findBlogById(id: string):Promise<blogsType | null> {
        return await blogsCollection.findOne({_id: new ObjectId(id)})
    },
    async createBlog(name: string, description: string, website: string):Promise<blogsType> {
        const newBlog: blogsType = {
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            websiteUrl: website,
        }
        const result = await blogsCollection.insertOne(newBlog)
        return {
            id: newBlog._id!.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt
        }
    },
    async updateBlog(id: string, name: string, description: string, website: string):Promise<boolean> {
        const result = await blogsCollection
            .updateOne({_id: new ObjectId(id)}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    },
    async deleteBlog(id: string):Promise<boolean> {
        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async deleteAllBlogs():Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}