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


export class allPostsUIType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: postUIType[]
    ) {
    }
}

export class commentUIType {
    constructor(
        public id: string,
        public content: string,
        public commentatorInfo: {
            userId: string,
            userLogin: string
        },
        public createdAt: string,
        public likesInfo: {
            likesCount: number,
            dislikesCount: number,
            myStatus: string
        }
    ) {
    }
}

export class allCommentsUIType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: commentUIType[]
    ) {
    }
}

export class authDeviceUIType {
    constructor(
        public id: string,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
    ) {
    }
}

export class userUIType {
    constructor(
        public id: string,
        public login: string,
        public email: string,
        public createdAt: string,
    ) {
    }
}

export class allUsersUIType {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: userUIType[]
    ) {
    }
}

export class authCurrentUserUIType {
    constructor(
        public userId: string,
        public login: string,
        public email: string,
    ) {
    }
}

export class accessTokenUIType {
    constructor(
        public accessToken: string,
    ) {
    }
}