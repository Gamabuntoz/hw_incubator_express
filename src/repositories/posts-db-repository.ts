import {blogsRepository} from "./blogs-db-repository";
import {client} from "./db";
import {ObjectId} from "mongodb";

export type postsType = {
    id?: string
    _id?: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string | undefined
    blogName: string
    createdAt: string
}

export type postsArrayType = Array<postsType>

const postsCollection = client.db().collection<postsType>("posts")

export const postsRepository = {
    async findAllPosts():Promise<postsArrayType> {
        const result = await postsCollection.find({}).toArray()
        return result.map(p => ({
            id: p._id!.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt
            })
        )
    },
    async findPostById(id: string): Promise<postsType | null | boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e){
            console.log(e)
            return false
        }
        const result = await postsCollection.findOne({_id: postId})
        if (!result) {
            return false
        }
        return {
            id: result._id!.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string):Promise<postsType> {
        const postById = await blogsRepository.findBlogById(blogId)
        const newPost: postsType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: typeof postById !== "boolean" ? postById.id : "f",
            blogName: typeof postById !== "boolean" ? postById.name : "f",
            createdAt: new Date().toISOString()
        }
        const result = await postsCollection.insertOne(newPost)
        return {
            id: newPost._id!.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
        const result = await postsCollection
            .updateOne({_id: new ObjectId(id)}, {$set: {title: title, shortDescription: shortDescription, content: content, blogId: blogId}})
        return result.matchedCount === 1
    },
    async deletePost(id: string):Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e){
            console.log(e)
            return false
        }
        const result = await postsCollection.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllPosts():Promise<boolean> {
        const result = await postsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}