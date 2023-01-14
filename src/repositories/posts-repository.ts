import {usersRepository} from "./users-repository";
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
            let foundPostsById = postsArray.find(p => p.id === id)
            return foundPostsById
    },
    findAllPosts() {
        return postsArray
    },
    createPost(authorization: string | undefined, title: string, shortDescription: string, content: string, blogId: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
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
        }
        return
    },
    updatePost(authorization: string | undefined, id: string, title: string, shortDescription: string, content: string, blogId: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                foundPostById.title = title
                foundPostById.shortDescription = shortDescription
                foundPostById.content = content
                foundPostById.blogId = blogId
                return true
            }
            return 'Not found'
        }
        return
    },
    deletePost(authorization: string | undefined, id: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
            let foundPostById = postsArray.find(p => p.id === id)
            if (foundPostById) {
                postsArray = postsArray.filter(p => p !== foundPostById)
                return true
            }
            return 'Not found'
        }
        return
    },
    deleteAllPosts() {
        postsArray.splice(0, postsArray.length)
    }
}