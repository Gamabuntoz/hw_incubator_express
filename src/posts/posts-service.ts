import {postsCommandsRepository} from "./posts-commands-repository";
import {ObjectId} from "mongodb";
import {blogsService} from "../blogs/blogs-service";
import {commentsRepository} from "../comments/comments-repository";
import {commentDBType, postDBType, postsLikesDBType} from "../db/DB-types";
import {commentUIType, postUIType, userUIType} from "../db/UI-types";
import {tryObjectId} from "../middlewares/input-validation-middleware";
import {PostLikesModelClass, UserModelClass} from "../db/db";


export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postUIType | boolean> {
        const blogById = await blogsService.findBlogById(new ObjectId(blogId))
        if (!blogById) return false
        const newPost: postDBType = {
            _id: new ObjectId(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogById.name,
            createdAt: new Date().toISOString(),
        }
        const result = await postsCommandsRepository.createPost(newPost)
        return {
            id: result._id!.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: []
            }
        }
    },
    async createCommentByPostId(content: string, user: userUIType | null, postId: string): Promise<commentUIType> {
        const newComment: commentDBType = {
            _id: new ObjectId(),
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: user!.id,
                userLogin: user!.login
            },
            createdAt: new Date().toISOString()
        }
        await commentsRepository.createComment(newComment)
        return {
            id: newComment._id!.toString(),
            content: newComment.content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None",
            }
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const postId = tryObjectId(id)
        if (!postId) return false
        return postsCommandsRepository.updatePost(postId, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        const postId = tryObjectId(id)
        if (!postId) return false
        return postsCommandsRepository.deletePost(postId)
    },
    async setLike(likeStatus: string, postId: string, userId: string) {
        const like: postsLikesDBType = {
            _id: new ObjectId(),
            postId: postId,
            userId: userId,
            status: likeStatus,
            addedAt: new Date()
        }
        await postsCommandsRepository.setLike(like)
        return true
    },
    async updateLike(likeStatus: string, postId: string, userId: string) {
        const updateLike = await postsCommandsRepository.updateLike(likeStatus, postId, userId)
        if (!updateLike) return false
        return true
    },
    async postsInfo(p: postDBType, lastPostLikes: postsLikesDBType[], likeInfo?: postsLikesDBType | null,) {
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
}