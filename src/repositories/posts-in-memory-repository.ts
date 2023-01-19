import {blogsRepository} from "./blogs-in-memory-repository";

export type postsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export type postsArrayType = Array<postsType>
let postsArray: postsArrayType = []

export const postsRepository = {
    async findAllPosts(): Promise<postsArrayType> {
        return postsArray
    },
    async findPostById(id: string): Promise<postsType | undefined> {
        return postsArray.find(p => p.id === id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string):Promise<postsType> {
            const postById = await blogsRepository.findBlogById(blogId)
            const newPost: postsType = {
                id: (postsArray.length + 1).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: postById!.id,
                blogName: postById!.name,
            }
            postsArray.push(newPost)
            return newPost
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string):Promise<boolean> {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                foundPostById.title = title
                foundPostById.shortDescription = shortDescription
                foundPostById.content = content
                foundPostById.blogId = blogId
                return true
            }
            return false
    },
    async deletePost(id: string):Promise<boolean> {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                postsArray = postsArray.filter(p => p !== foundPostById)
                return true
            }
            return false
    },
    deleteAllPosts() {
        postsArray.splice(0, postsArray.length)
    }
}