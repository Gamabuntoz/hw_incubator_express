import {ObjectId} from "mongodb";
import {CommentModelClass, PostModelClass} from "../db/db";
import {allCommentsUIType, allPostsUIType, postUIType} from "../db/UI-types";

export const postsQueryRepository = {
    async findAllPosts(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<allPostsUIType> {
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
            .lean()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: findAll.map(p => ({
                    id: p._id!.toString(),
                    title: p.title,
                    shortDescription: p.shortDescription,
                    content: p.content,
                    blogId: p.blogId,
                    blogName: p.blogName,
                    createdAt: p.createdAt
                })
            )
        }
    },
    async findPostById(postId: ObjectId): Promise<postUIType | boolean> {
        const result = await PostModelClass.findOne({_id: postId})
        if (!result) return false
        return {
            id: result._id!.toString(),
            title: result.title,
            shortDescription: result.shortDescription,
            content: result.content,
            blogId: result.blogId,
            blogName: result.blogName,
            createdAt: result.createdAt
        }
    },
    async findAllCommentsByPostId(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, postId: string): Promise<allCommentsUIType> {
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
            items: findAll.map(c => ({
                    id: c._id!.toString(),
                    content: c.content,
                    commentatorInfo: c.commentatorInfo,
                    createdAt: c.createdAt
                })
            )
        }
    }
}