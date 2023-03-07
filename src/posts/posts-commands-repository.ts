import {PostLikesModelClass, PostModelClass} from "../db/db";
import {ObjectId} from "mongodb";
import {postDBType, postsLikesDBType} from "../db/DB-types";

export const postsCommandsRepository = {
    async createPost(newPost: postDBType): Promise<postDBType> {
        await PostModelClass.create(newPost)
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
    async setLike(like: postsLikesDBType) {
        await PostLikesModelClass.create(like)
        return like
    },
    async updateLike(likeStatus: string, postId: string, userId: string, addedAt: Date) {
        const result = await PostLikesModelClass.updateOne({postId: postId, userId: userId}, {$set: {status: likeStatus}})
        return result.matchedCount === 1
    },
}