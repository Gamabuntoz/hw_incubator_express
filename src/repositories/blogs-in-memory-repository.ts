export type blogsType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
export type blogsArrayType = Array<blogsType>
let blogsArray: blogsArrayType = []

export const blogsRepository = {
    async findAllBlogs():Promise<blogsArrayType> {
        return blogsArray
    },
    async findBlogById(id: string):Promise<blogsType | undefined> {
        return blogsArray.find(b => b.id === id)
    },
    async createBlog(name: string, description: string, website: string):Promise<blogsType> {
            const newBlog: blogsType = {
                id: (blogsArray.length + 1).toString(),
                name: name,
                description: description,
                websiteUrl: website,
            }
            blogsArray.push(newBlog)
            return newBlog
    },
    async updateBlog(id: string, name: string, description: string, website: string):Promise<boolean> {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                foundBlogById.name = name
                foundBlogById.description = description
                foundBlogById.websiteUrl = website
                return true
            }
            return false
    },
    async deleteBlog(id: string):Promise<boolean> {
            let foundBlogById = blogsArray.find(b => b.id === id)
            if (foundBlogById) {
                blogsArray = blogsArray.filter(b => b !== foundBlogById)
                return true
            }
            return false
    },
    deleteAllBlogs() {
        blogsArray.splice(0, blogsArray.length)
    },
    checkBlogById(id: string):blogsType | undefined {
        return blogsArray.find(b => b.id === id)
    }
}