import {WithId} from "mongodb";

export type blogDBType = WithId<{
    createdAt: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
}>

export type postDBType = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}>

export type commentsLikesDBType = WithId<{
    userId: string
    commentId: string
    status: string
}>

export type postsLikesDBType = WithId<{
    userId: string
    postId: string
    status: string
    addedAt: Date
}>

export type userDBType = WithId<{
    accountData: {
        login: string
        email: string
        passwordHash: string
        createdAt: string
    },
    emailConfirmation: {
        confirmationCode: string
        isConfirmed: boolean
        expirationDate: Date
    },
    passwordRecovery: {
        code: string
        expirationDate: Date
    }
}>

type commentatorInfoType = {
    userId: string
    userLogin: string
}

export type commentDBType = WithId<{
    postId: string
    content: string
    commentatorInfo: commentatorInfoType
    createdAt: string
}>

export type authDeviceDBType = WithId<{
    issueAt: number
    expiresAt: number
    ipAddress: string
    deviceName: string
    userId: string
    deviceId: string
}>

export type attemptDBType = WithId<{
    ip: string
    url: string
    time: Date
}>



