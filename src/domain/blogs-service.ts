import {blogsRepository} from "../repositories/blogs-repositories/blogs-command-repository";
import {ObjectId} from "mongodb";
import {blogsType} from "../repositories/blogs-repositories/blogs-command-repository";


export const blogsService = {
    async createBlog(name: string, description: string, website: string): Promise<blogsType> {
        const newBlog: blogsType = {
            createdAt: new Date().toISOString(),
            name: name,
            description: description,
            websiteUrl: website,
        }
        const result = await blogsRepository.createBlog(newBlog)
        return {
            id: result._id!.toString(),
            name: result.name,
            description: result.description,
            websiteUrl: result.websiteUrl,
            createdAt: result.createdAt,
        }
    },
    async updateBlog(id: string, name: string, description: string, website: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return blogsRepository.updateBlog(postId, name, description, website)
    },
    async deleteBlog(id: string): Promise<boolean> {
        let postId: ObjectId;
        try {
            postId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return blogsRepository.deleteBlog(postId)
    },
    async deleteAllBlogs(): Promise<boolean> {
        return blogsRepository.deleteAllBlogs()
    }
}