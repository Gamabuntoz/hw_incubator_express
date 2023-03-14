import {ObjectId} from "mongodb";
import {CommentLikesModelClass, CommentModelClass, PostLikesModelClass, PostModelClass, UserModelClass} from "../db/db";
import {allCommentsUIType, allPostsUIType, postUIType} from "../db/UI-types";

export const postsQueryRepository = {
    async findAllPosts(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number, userId: string): Promise<allPostsUIType> {
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await PostModelClass.countDocuments({})
        const findAll = await PostModelClass
            .find({})
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(findAll.map(async (p) => {
                    let likeInfo
                    if (userId) {
                        likeInfo = await PostLikesModelClass.findOne({postId: p._id.toString(), userId: userId}).lean()
                    }
                    const lastPostLikes = await this.findLastPostLikes(p._id!.toString())
                    return {
                        id: p._id!.toString(),
                        title: p.title,
                        shortDescription: p.shortDescription,
                        content: p.content,
                        blogId: p.blogId,
                        blogName: p.blogName,
                        createdAt: p.createdAt,
                        extendedLikesInfo: {
                            likesCount: await PostLikesModelClass.countDocuments({
                                postId: p._id!.toString(),
                                status: "Like"
                            }),
                            dislikesCount: await PostLikesModelClass.countDocuments({
                                postId: p._id!.toString(),
                                status: "Dislike"
                            }),
                            myStatus: likeInfo ? likeInfo.status : "None",
                            newestLikes: await Promise.all(lastPostLikes.map(async (l) => {
                                        let user = await UserModelClass.findOne({_id: new ObjectId(l.userId)})
                                        return {
                                            addedAt: l.addedAt.toISOString(),
                                            userId: l.userId,
                                            login: user!.accountData.login
                                        }
                                    }
                                )
                            )
                        }
                    }
                }
            ))
        }
    },
    async findPostById(postId: ObjectId, userId: string): Promise<postUIType | boolean> {
        const result = await PostModelClass.findOne({_id: postId})
        if (!result) return false
        const likesInfo = await PostLikesModelClass.countDocuments({postId: postId.toString(), status: "Like"})
        const dislikesInfo = await PostLikesModelClass.countDocuments({postId: postId.toString(), status: "Dislike"})
        let like
        if (userId) {
            like = await PostLikesModelClass.findOne({postId: postId.toString(), userId: userId})
        }
        const lastPostLikes = await this.findLastPostLikes(postId.toString())
        return {
            id: result._id!.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: likesInfo,
                dislikesCount: dislikesInfo,
                myStatus: like ? like.status : "None",
                newestLikes: await Promise.all(lastPostLikes.map(async (l) => {
                            let user = await UserModelClass.findOne({_id: new ObjectId(l.userId)})
                            return {
                                addedAt: l.addedAt.toISOString(),
                                userId: l.userId,
                                login: user!.accountData.login
                            }
                        }
                    )
                )
            }
        }
    },
    async findAllCommentsByPostId(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, postId: string, userId: string): Promise<allCommentsUIType> {
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await CommentModelClass.countDocuments({postId: postId})
        const findAll = await CommentModelClass
            .find({postId: postId})
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(findAll.map(async (c) => {
                    let likeInfo
                    if (userId) {
                        likeInfo = await CommentLikesModelClass.findOne({commentId: c._id.toString(), userId: userId})
                    }
                    return {
                        id: c._id!.toString(),
                        content: c.content,
                        commentatorInfo: c.commentatorInfo,
                        createdAt: c.createdAt,
                        likesInfo: {
                            dislikesCount: await CommentLikesModelClass.countDocuments({
                                commentId: c._id.toString(),
                                status: "Dislike"
                            }),
                            likesCount: await CommentLikesModelClass.countDocuments({
                                commentId: c._id.toString(),
                                status: "Like"
                            }),
                            myStatus: likeInfo ? likeInfo.status : "None"
                        }
                    }
                }
            ))
        }
    },
    async findLastPostLikes(postId: string) {
        const result = await PostLikesModelClass
            .find({postId: postId, status: "Like"})
            .sort({addedAt: -1})
            .limit(3)
            .lean()
        return result
    }
}