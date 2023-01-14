import {blogsRepository} from "./blogs-repository";

type postsType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
type postsArrayType = Array<postsType>
let postsArray: postsArrayType = []

export const postsRepository = {
    findPostById(id: string) {
        return postsArray.find(p => p.id === id)

    },
    findAllPosts() {
        return postsArray
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
            const postById = blogsRepository.findBlogById(blogId)
            const newPost: postsType = {
                id: (postsArray.length + 1).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: postById.id,
                blogName: postById.name,
            }
            postsArray.push(newPost)
            return newPost
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                foundPostById.title = title
                foundPostById.shortDescription = shortDescription
                foundPostById.content = content
                foundPostById.blogId = blogId
                return true
            }
            return 'Not found'
    },
    deletePost(id: string) {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                postsArray = postsArray.filter(p => p !== foundPostById)
                return true
            }
            return 'Not found'
    },
    deleteAllPosts() {
        postsArray.splice(0, postsArray.length)
    }
}