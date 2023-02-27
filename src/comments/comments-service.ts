import {ObjectId} from "mongodb";
import {CommentModel} from "../db/db";
import {commentsRepository} from "./comments-repository";
import {commentUIType} from "../db/UI-types";
import {tryObjectId} from "../middlewares/input-validation-middleware";

export const commentsService = {
    async findCommentById(commentId: ObjectId): Promise<commentUIType | boolean> {
        const result = await CommentModel.findOne({_id: commentId})
        if (!result) return false
        return {
            id: result._id.toString(),
            content: result.content,
            commentatorInfo: result.commentatorInfo,
            createdAt: result.createdAt
        }
    },
    async updateComment(content: string, id: string): Promise<boolean> {
        const commentId = tryObjectId(id)
        if (!commentId) return false
        return commentsRepository.updateComment(content, commentId)
    },
    async deleteComment(id: ObjectId): Promise<boolean> {
        return commentsRepository.deleteComment(id)
    },
    async deleteAllComments(): Promise<boolean> {
        return commentsRepository.deleteAllComments()
    }
}