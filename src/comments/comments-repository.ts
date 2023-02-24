import {commentType} from "../db/DB-types";
import {CommentModel} from "../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findComment(commentId: ObjectId): Promise<commentType | null> {
        return CommentModel.findOne({_id: commentId})
    },
    async createComment(newComment: commentType): Promise<commentType> {
        await CommentModel.create(newComment)
        return newComment
    },
    async updateComment(content: string, commentId: ObjectId): Promise<boolean> {
        const result = await CommentModel
            .updateOne({_id: commentId}, {$set: {content: content}})
        return result.matchedCount === 1
    },
    async deleteComment(commentId: ObjectId): Promise<boolean> {
        const result = await CommentModel.deleteOne({_id: commentId})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await CommentModel.deleteMany({})
        return result.deletedCount === 1
    }
}