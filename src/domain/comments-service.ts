import {usersRepository} from "../repositories/users-repository";
import {ObjectId} from "mongodb";
import {commentsType, usersType} from "../repositories/types/types";
import {commentsCollection} from "../repositories/db";
import {commentsRepository} from "../repositories/comments/comments-repository";

export const commentsService ={
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
    async deleteComment(id: string): Promise<boolean> {
        let comentId: ObjectId;
        try {
            comentId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return commentsRepository.deleteComment(comentId)
    },
    async deleteAllComments(): Promise<boolean> {
        return commentsRepository.deleteAllComments()
    }
}