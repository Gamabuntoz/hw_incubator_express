import {commentDBType, commentsLikesDBType} from "../db/DB-types";
import {CommentLikesModelClass, CommentModelClass} from "../db/db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async findComment(commentId: ObjectId): Promise<commentDBType | null> {
        return CommentModelClass.findOne({_id: commentId})
    },
    async createComment(newComment: commentDBType): Promise<commentDBType> {
        await CommentModelClass.create(newComment)
        return newComment
    },
    async setLike(like: commentsLikesDBType) {
        await CommentLikesModelClass.create(like)
        return like
    },
    async updateComment(content: string, commentId: ObjectId): Promise<boolean> {
        const result = await CommentModelClass
            .updateOne({_id: commentId}, {$set: {content: content}})
        return result.matchedCount === 1
    },
    async deleteComment(commentId: ObjectId): Promise<boolean> {
        const result = await CommentModelClass.deleteOne({_id: commentId})
        return result.deletedCount === 1
    },
    async deleteAllComments(): Promise<boolean> {
        const result = await CommentModelClass.deleteMany({})
        return result.deletedCount === 1
    }
}