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

const blogsCollection = client.db().collection<blogsType>("blogs")

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
    async findBlogById(id: string): Promise<boolean | blogsType> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e){
            console.log(e)
            return false
        }
        const result = await blogsCollection.findOne({_id: postId})
        if (!result) {
            return false
        }
        return {
            id: result._id!.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt
        }
    },
    async createBlog(name: string, description: string, website: string): Promise<blogsType> {
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
    async updateBlog(id: string, name: string, description: string, website: string): Promise<boolean> {
        const result = await blogsCollection
            .updateOne({_id: new ObjectId(id)}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e){
            console.log(e)
            return false
        }
        const result = await blogsCollection.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}