import {ObjectId} from "mongodb";
import {commentsType} from "../db/types";
import {commentsCollection} from "../db/db";
import {commentsRepository} from "./comments-repository";

export const commentsService = {
    async findCommentById(commentId: ObjectId): Promise<commentsType | boolean | null> {
        const result = await commentsCollection.findOne({_id: commentId})
        if (!result) {
            return false
        }
        return {
            id: result._id.toString(),
            content: result.content,
            commentatorInfo: result.commentatorInfo,
            createdAt: result.createdAt
        }
    },
    async updateComment(content: string, id: string): Promise<commentsType | boolean> {
        let commentId: ObjectId;
        try {
            commentId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return commentsRepository.updateComment(content, commentId)
    },
    async deleteComment(id: ObjectId): Promise<boolean> {
        return commentsRepository.deleteComment(id)
    },
    async deleteAllComments(): Promise<boolean> {
        return commentsRepository.deleteAllComments()
    }
}