import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {
    commentIdQueryMiddleware,
    inputCommentsValidation,
    inputValidationErrors
} from "../middlewares/input-validation-middleware";
import {ObjectId} from "mongodb";
import {commentsService} from "./comments-service";
import {commentsRepository} from "./comments-repository";
import {authMiddlewareBearer, optionalAuthCheck} from "../middlewares/authorization-middleware";
import {commentUIType} from "../db/UI-types";
import {commentDBType} from "../db/DB-types";

export const commentsRouter = Router()

commentsRouter.get("/:id",
    commentIdQueryMiddleware,
    optionalAuthCheck,
    async (req: Request, res: Response) => {
        const findCommentById: commentUIType | boolean = await commentsService
            .findCommentById(new ObjectId(req.params.id), req.user?.id)
        res.status(sendStatus.OK_200).send(findCommentById)
    })
commentsRouter.put("/:id",
    authMiddlewareBearer,
    inputCommentsValidation.content,
    inputValidationErrors,
    commentIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const findComment: commentDBType | null = await commentsRepository.findComment(new ObjectId(req.params.id))
        if (req.user!.id !== findComment!.commentatorInfo.userId) {
            return res.sendStatus(sendStatus.FORBIDDEN_403)
        }
        const content = req.body.content
        const updateComment: boolean = await commentsService.updateComment(content, req.params.id)
        if (!updateComment) return res.sendStatus(sendStatus.NOT_FOUND_404)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
commentsRouter.put("/:id/like-status",
    authMiddlewareBearer,
    inputCommentsValidation.likeStatus,
    inputValidationErrors,
    commentIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const likeStatus = req.body.likeStatu
        const updateLike = await commentsService.updateLike(likeStatus, req.params.id, req.user.id)
        if (updateLike) res.sendStatus(sendStatus.NO_CONTENT_204)
        const setLike: boolean = await commentsService.setLike(likeStatus, req.params.id, req.user.id)
        if (!setLike) return res.sendStatus(sendStatus.NOT_FOUND_404)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
commentsRouter.delete("/:id",
    authMiddlewareBearer,
    commentIdQueryMiddleware,
    async (req: Request, res: Response) => {
        const findComment: commentDBType | null = await commentsRepository.findComment(new ObjectId(req.params.id))
        if (req.user!.id !== findComment!.commentatorInfo.userId) {
            return res.sendStatus(sendStatus.FORBIDDEN_403)
        }
        const foundComment = await commentsService.deleteComment(new ObjectId(req.params.id))
        if (!foundComment) return res.sendStatus(sendStatus.NOT_FOUND_404)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })