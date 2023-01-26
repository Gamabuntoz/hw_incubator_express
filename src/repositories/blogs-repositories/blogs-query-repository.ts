import {Filter, ObjectId} from "mongodb";
import {blogsType, findBlogsType, findPostsType} from "../types/types";
import {blogsCollection, postsCollection} from "../db";


export const blogsQueryRepository = {
    async findAllBlogs(searchNameTerm: string | undefined, sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number): Promise<findBlogsType> {
        const filter: Filter<blogsType> = {}
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: "$i"}
        }
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await blogsCollection.countDocuments(filter)
        const findAll = await blogsCollection
            .find(filter)
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

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
                    createdAt: b.createdAt
                })
            )
        }
    },

    async findBlogById(postId: ObjectId): Promise<null | blogsType> {
        const result = await blogsCollection.findOne({_id: postId})
        if (!result) {
            return null
        }
        return {
            id: result._id!.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt
        }
    },

    async findAllPostsByBlogId(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, blogId: string): Promise<null | findPostsType> {
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await postsCollection.countDocuments({blogId: blogId})
        const findAll = await postsCollection
            .find({blogId: blogId})
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
    }
}