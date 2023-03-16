import {ObjectId} from "mongodb";
import {BlogModelClass, PostLikesModelClass, PostModelClass} from "../db/db";
import {allBlogsUIType, allPostsUIType, blogUIType} from "../db/UI-types";
import {postsQueryRepository} from "../posts/posts-query-repository";
import {postsService} from "../posts/posts-service";


export class BlogsQueryRepository {
    async findAllBlogs(searchNameTerm: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<allBlogsUIType> {
        let filter = {}
        if (searchNameTerm) {
            filter = {name: {$regex: searchNameTerm, $options: "$i"}}
        }
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await BlogModelClass.countDocuments(filter)
        const findAll = await BlogModelClass
            .find(filter)
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return new allBlogsUIType(
            Math.ceil(totalCount / pageSize),
            pageNumber,
            pageSize,
            totalCount,
            findAll.map(b => new blogUIType(
                b._id.toString(),
                b.name,
                b.description,
                b.websiteUrl,
                b.createdAt,
                b.isMembership
            ))
        )
    }

    async findBlogById(blogId: ObjectId): Promise<null | blogUIType> {
        const result = await BlogModelClass.findOne({_id: blogId})
        if (!result) return null
        return new blogUIType(
            result._id.toString(),
            result.name,
            result.description,
            result.websiteUrl,
            result.createdAt,
            result.isMembership
        )
    }

    async findAllPostsByBlogId(blogId: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number, userId: string): Promise<null | allPostsUIType> {
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await PostModelClass.countDocuments({blogId: blogId})
        const findAll = await PostModelClass
            .find({blogId: blogId})
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: await Promise.all(findAll.map(async (p) => {
                    let likeInfo
                    if (userId) {
                        likeInfo = await PostLikesModelClass.findOne({postId: p._id.toString(), userId: userId})
                    }
                    const lastPostLikes = await postsQueryRepository.findLastPostLikes(p._id!.toString())
                    return postsService.postsInfo(p, lastPostLikes, likeInfo)
                }
            ))
        }
    }
}