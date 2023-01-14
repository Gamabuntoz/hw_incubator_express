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
    createBlog(name: string, description: string, website: string) {
            const newBlog: blogsType = {
                id: (blogsArray.length + 1).toString(),
                name: name,
                description: description,
                websiteUrl: website,
            }
            blogsArray.push(newBlog)
            return newBlog
    },
    updateBlog(id: string, name: string, description: string, website: string) {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                foundBlogById.name = name
                foundBlogById.description = description
                foundBlogById.websiteUrl = website
                return true
            }
            return 'Not found'
    },
    deleteBlog(id: string) {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                blogsArray = blogsArray.filter(b => b !== foundBlogById)
                return true
            }
            return 'Not found'
    },
    deleteAllBlogs() {
        blogsArray.splice(0, blogsArray.length)
    }
}