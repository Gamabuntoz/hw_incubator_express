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

export type blogsArrayType = Array<blogsType>
export type postsArrayType = Array<postsType>
export type usersArrayType = Array<usersType>

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



