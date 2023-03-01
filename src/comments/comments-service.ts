import {ObjectId} from "mongodb";
import {CommentLikesModelClass, CommentModelClass} from "../db/db";
import {commentsRepository} from "./comments-repository";
import {commentUIType} from "../db/UI-types";
import {tryObjectId} from "../middlewares/input-validation-middleware";

export const commentsService = {
    async findCommentById(commentId: ObjectId, userId: string): Promise<commentUIType | boolean> {
        const result = await CommentModelClass.findOne({_id: commentId})
        const likesInfo = await CommentLikesModelClass.countDocuments({commentId: commentId.toString(), status: "Like"})
        const dislikesInfo = await CommentLikesModelClass.countDocuments({commentId: commentId.toString(), status: "Dislike"})
        let like
        if (userId) {
            like = await CommentLikesModelClass.findOne({commentId: commentId.toString(), userId: userId})
        }
        if (!result) return false
        return {
            id: result._id.toString(),
            content: result.content,
            commentatorInfo: result.commentatorInfo,
            createdAt: result.createdAt,
            likesInfo: {
                likesCount: likesInfo,
                dislikesCount: dislikesInfo,
                myStatus: like ? like.status : "None"
            }
        }
    },
    async setLike(likeStatus: string, commentId: string, userId: string) {
        const like = {
            _id: new ObjectId(),
            userId: userId,
            commentId: commentId,
            status: likeStatus
        }
        await commentsRepository.setLike(like)
        return true
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