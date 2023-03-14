export class blogUIType {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,
    ) {
    }
}

export class allBlogsUIType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: blogUIType[]
    ) {
    }
}

type newestLikesType = {
    addedAt: string
    userId: string
    login: string
}

export class postUIType {
    public constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public extendedLikesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string,
            newestLikes: newestLikesType[]
        }
    ) {
    }
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