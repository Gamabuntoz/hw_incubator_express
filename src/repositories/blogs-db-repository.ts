import {client} from "./db";

export type blogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
export type blogsArrayType = Array<blogsType>
let blogsArray: blogsArrayType = []

const blogsCollection = client.db().collection<blogsType>("blogs")

export const blogsRepository = {
    async findAllBlogs():Promise<blogsArrayType> {
        return await blogsCollection.find({}).toArray()
    },
    async findBlogById(id: string):Promise<blogsType | null> {
        return await blogsCollection.findOne({id: id})
    },
    async createBlog(name: string, description: string, website: string):Promise<blogsType> {
        const newBlog: blogsType = {
            id: (blogsArray.length + 1).toString(),
            name: name,
            description: description,
            websiteUrl: website,
        }
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog
    },
    async updateBlog(id: string, name: string, description: string, website: string):Promise<boolean> {
        const result = await blogsCollection
            .updateOne({id: id}, {$set: {name: name, description: description, websiteUrl: website}})
        return result.matchedCount === 1
    },
    async deleteBlog(id: string):Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllBlogs():Promise<boolean> {
        const result = await blogsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}