import {blogsRepository} from "./blogs-db-repository";
import {client} from "./db";

export type postsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export type postsArrayType = Array<postsType>
let postsArray: postsArrayType = []

const postsCollection = client.db().collection<postsType>("posts")

export const postsRepository = {
    async findAllPosts():Promise<postsArrayType> {
        return await postsCollection.find({}).toArray()
    },
    async findPostById(id: string): Promise<postsType | null> {
        return await postsCollection.findOne({id: id})
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string):Promise<postsType> {
        const postById = await blogsRepository.findBlogById(blogId)
        const newPost: postsType = {
            id: (postsArray.length + 1).toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: postById!["id"],
            blogName: postById!["name"],
        }
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
        const result = await postsCollection
            .updateOne({id: id}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    },
    async deletePost(id: string):Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async deleteAllPosts():Promise<boolean> {
        const result = await postsCollection.deleteMany({})
        return result.deletedCount === 1
    },
}