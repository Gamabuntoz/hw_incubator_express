import {ObjectId} from "mongodb";

export type blogDBType = {
    _id: ObjectId
    createdAt: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
}

export type postDBType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type userDBType = {
    _id: ObjectId
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
}

type commentatorInfoType = {
    userId: string
    userLogin: string
}

export type commentDBType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: commentatorInfoType
    createdAt: string
}

export type authDeviceDBType = {
    _id: ObjectId
    issueAt: number
    expiresAt: number
    ipAddress: string
    deviceName: string
    userId: string
    deviceId: string
}

export type attemptDBType = {
    _id: ObjectId
    ip: string
    url: string
    time: Date
}



