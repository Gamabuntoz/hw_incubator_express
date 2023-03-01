import {PostModelClass} from "../db/db";
import {ObjectId} from "mongodb";
import {postDBType} from "../db/DB-types";
import {postUIType} from "../db/UI-types";
import {tryObjectId} from "../middlewares/input-validation-middleware";

export const postsCommandsRepository = {
    async findAllPosts(): Promise<postUIType[]> {
        const result = await PostModelClass.find({}).lean()
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
    async findPostById(id: string): Promise<postUIType | boolean> {
        const postId = tryObjectId(id)
        if (!postId) return false
        const result = await PostModelClass.findOne({_id: postId})
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

    async createPost(newPost: postDBType): Promise<postDBType> {
        const result = await PostModelClass.create(newPost)
        return newPost
    },
    async updatePost(postId: ObjectId, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostModelClass
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
        const result = await PostModelClass.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await PostModelClass.deleteMany({})
        return result.deletedCount === 1
    }
}