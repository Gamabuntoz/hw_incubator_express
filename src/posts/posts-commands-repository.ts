import {PostModel} from "../db/db";
import {ObjectId} from "mongodb";
import {postDBType} from "../db/DB-types";

export const postsCommandsRepository = {
    async findAllPosts(): Promise<postType[]> {
        const result = await PostModel.find({}).lean()
        return result.map(p => ({
                id: p._id!.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            })
        )
    },
    async findPostById(id: string): Promise<postsType | null | boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        const result = await PostModel.findOne({_id: postId})
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


    async createPost(newPost: postsType): Promise<postsType> {
        const result = await PostModel.create(newPost)
        return newPost
    },
    async updatePost(postId: ObjectId, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const result = await PostModel
            .updateOne({_id: postId}, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId
                }
            })
        return result.matchedCount === 1
    },
    async deletePost(postId: ObjectId): Promise<boolean> {
        const result = await PostModel.deleteOne({_id: postId})
        return result.deletedCount === 1
    },
    async deleteAllPosts(): Promise<boolean> {
        const result = await PostModel.deleteMany({})
        return result.deletedCount === 1
    }
}