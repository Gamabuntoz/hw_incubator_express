import {Request, Response, Router} from "express";
import {commentsType, usersType} from "../../repositories/types/types";
import {usersService} from "../../domain/users-service";
import {sendStatus} from "../../repositories/status-collection";
import {
    authMiddlewareBearer,
    inputCommentsValidation,
    inputValidationErrors
} from "../../middlewares/input-validation-middleware";
import {ObjectId} from "mongodb";
import {commentsService} from "../../domain/comments-service";

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    let commentId: ObjectId;
    try {
        commentId = new ObjectId(req.params.id)
    } catch (e) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return false
    }
    const findCommentById: commentsType | boolean | null = await commentsService
        .findCommentById(commentId)
    if (!findCommentById) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    res.status(sendStatus.OK_200).send(findCommentById)
})
commentsRouter.put('/:id',
    authMiddlewareBearer,
    inputCommentsValidation.content,
    inputValidationErrors,
    async (req: Request, res: Response) => {
    const commentId = req.params.id
        const content = req.body.content
        const updateComment: commentsType | boolean = await commentsService.updateComment(content, commentId)
        if (!updateComment) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
commentsRouter.delete('/:id',
    authMiddlewareBearer,
    async (req: Request, res: Response) => {
        const foundComment = await commentsService.deleteComment(req.params.id)
        if (!foundComment) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })