import {commentsType} from "../types/types";
import {commentsCollection} from "../db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async createComment(newComment: commentsType): Promise<commentsType> {
        const result = await commentsCollection.insertOne(newComment)
        return newComment
    },
    async updateComment(content: string, commentId: ObjectId): Promise<boolean> {
        const result = await commentsCollection
            .updateOne({_id: commentId}, {$set: {content: content}})
        return result.matchedCount === 1
    },
    async deleteComment(commentId: ObjectId): Promise<boolean> {
        const result = await commentsCollection.deleteOne({_id: commentId})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await commentsCollection.deleteMany({})
        return result.deletedCount === 1
    }
}