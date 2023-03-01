import {ObjectId} from "mongodb";
import {BlogModelClass, PostModelClass} from "../db/db";
import {allBlogsUIType, allPostsUIType, blogUIType} from "../db/UI-types";


export const blogsQueryRepository = {
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
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: findAll.map(b => ({
                    id: b._id!.toString(),
                    name: b.name,
                    description: b.description,
                    websiteUrl: b.websiteUrl,
                    createdAt: b.createdAt,
                    isMembership: b.isMembership
                })
            )
        }
    },

    async findBlogById(blogId: ObjectId): Promise<null | blogUIType> {
        const result = await BlogModelClass.findOne({_id: blogId})
        if (!result) return null
        return {
            id: result._id.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt,
            isMembership: result.isMembership
        }
    },

    async findAllPostsByBlogId(blogId: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<null | allPostsUIType> {
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
    }
}