export type blogUIType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}
export type allBlogsUIType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: blogUIType[]
}

export type postUIType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type allPostsUIType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: postUIType[]
}

type commentatorInfoType = {
    userId: string
    userLogin: string
}
export type commentUIType = {
    id: string
    content: string
    commentatorInfo: commentatorInfoType
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}
export type allCommentsUIType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: commentUIType[]
}

export type authDeviceUIType = {
    id: string
    title: string
    lastActiveDate: string
    deviceId: string
}

export type userUIType = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type allUsersUIType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: userUIType[]
}

export type authCurrentUserUIType = {
    userId: string
    login: string
    email: string
}

export type accessTokenUIType = {
    accessToken: string
}