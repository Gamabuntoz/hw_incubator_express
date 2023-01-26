import {ObjectId} from "mongodb";
import {findPostsType, postsType} from "../types/types";
import {postsCollection} from "../db";

export const postsQueryRepository = {
    async findAllPosts(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<findPostsType> {
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await postsCollection.countDocuments({})
        const findAll = await postsCollection
            .find({})
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

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
    async findPostById(postId: ObjectId): Promise<postsType | null | boolean> {
        const result = await postsCollection.findOne({_id: postId})
        if (!result) {
            return false
        }
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
}