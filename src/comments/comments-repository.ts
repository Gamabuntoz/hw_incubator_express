import {commentsType} from "../db/types";
import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findComment(commentId: ObjectId): Promise<commentsType | null> {
        const result = await commentsCollection.findOne({_id: commentId})
        return result
    },
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