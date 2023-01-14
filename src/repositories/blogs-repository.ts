import {usersRepository} from "./users-repository";

export type blogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
export type blogsArrayType = Array<blogsType>
let blogsArray: blogsArrayType = []

export const blogsRepository = {
    findAllBlogs(): blogsArrayType {
        return blogsArray
    },
    findBlogById(id: string): blogsType {
            let foundBlogById = blogsArray.find(b => b.id === id)
            return foundBlogById!
    },
    createBlog(authorization: string | undefined, name: string, description: string, website: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
            const newBlog: blogsType = {
                id: (blogsArray.length + 1).toString(),
                name: name,
                description: description,
                websiteUrl: website,
            }
            blogsArray.push(newBlog)
            return newBlog
        }
        return
    },
    updateBlog(authorization: string | undefined, id: string, name: string, description: string, website: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                foundBlogById.name = name
                foundBlogById.description = description
                foundBlogById.websiteUrl = website
                return true
            }
            return 'Not found'
        }
        return
    },
    deleteBlog(authorization: string | undefined, id: string) {
        if (authorization && usersRepository.find(u => u.loginPass === authorization)) {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                blogsArray = blogsArray.filter(b => b !== foundBlogById)
                return true
            }
            return 'Not found'
        }
        return
    },
    deleteAllBlogs() {
        blogsArray.splice(0, blogsArray.length)
    }
}