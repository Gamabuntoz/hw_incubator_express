import {ObjectId} from "mongodb";

export type blogsType = {
    createdAt: string
    name: string
    description: string
    websiteUrl: string
    id?: string
    _id?: ObjectId
}


export type postsType = {
    id?: string
    _id?: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string | undefined
    blogName: string
    createdAt: string
}

export type usersType = {
    id?: string
    _id?: ObjectId
    passwordHash?: string
    login: string
    email: string
    createdAt: string
}

export type commentsType = {
    id?: string
    _id?: ObjectId
    postId?: string
    content: string
    commentatorInfo: {
        userId: string | ObjectId | undefined
        userLogin: string
    }
    createdAt: string
}

export type blogsArrayType = Array<blogsType>
export type postsArrayType = Array<postsType>
export type usersArrayType = Array<usersType>
export type commentsArrayType = Array<commentsType>

export type findBlogsType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: blogsArrayType
}

export type findPostsType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: postsArrayType
}

export type findUsersType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: usersArrayType
}

export type findCommentsType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: commentsArrayType
}



