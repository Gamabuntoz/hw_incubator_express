import {postsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {postsArrayType, postsType} from "../db/types";

export const postsCommandsRepository = {
    async findAllPosts(): Promise<postsArrayType> {
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
        } catch (e) {
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


    async createPost(newPost: postsType): Promise<postsType> {
        const result = await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePost(postId: ObjectId, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await postsCollection
            .updateOne({_id: postId}, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId
                }
            })
        return result.matchedCount === 1
    },
    async deletePost(postId: ObjectId): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await postsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}