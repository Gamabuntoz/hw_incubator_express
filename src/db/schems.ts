import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {
    attemptDBType,
    authDeviceDBType,
    blogDBType,
    commentDBType,
    commentsLikesDBType,
    postDBType,
    userDBType
} from "./DB-types";


export const postSchema = new mongoose.Schema<postDBType>({
    _id: ObjectId,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
}, {collection: 'posts'})

export const blogSchema = new mongoose.Schema<blogDBType>({
    _id: ObjectId,
    createdAt: String,
    name: String,
    description: String,
    websiteUrl: String,
    isMembership: Boolean
}, {collection: 'blogs'})

export const userSchema = new mongoose.Schema<userDBType>({
    _id: ObjectId,
    accountData: {
        login: {type: String, unique: true, minlength: 3, maxlength: 10},
        email: String,
        passwordHash: String,
        createdAt: String,
    },
    emailConfirmation: {
        confirmationCode: String,
        isConfirmed: Boolean,
        expirationDate: Date,
    },
    passwordRecovery: {
        code: String,
        expirationDate: Date,
    }
}, {collection: 'users'})

export const deviceSchema = new mongoose.Schema<authDeviceDBType>({
    _id: ObjectId,
    ipAddress: String,
    deviceName: String,
    deviceId: String,
    issueAt: Date,
    expiresAt: Date,
    userId: String
}, {collection: 'devices'})

export const commentSchema = new mongoose.Schema<commentDBType>({
    _id: ObjectId,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String,
    },
    createdAt: String,
}, {collection: 'comments'})

export const adminSchema = new mongoose.Schema({
    _id: ObjectId,
    loginPass: String
}, {collection: 'admin'})

export const attemptSchema = new mongoose.Schema<attemptDBType>({
    _id: ObjectId,
    ip: String,
    url: String,
    time: Date
}, {collection: 'authAttempts'})

export const commentLikesSchema = new mongoose.Schema<commentsLikesDBType>({
    _id: ObjectId,
    userId: String,
    commentId: String,
    status: Date
}, {collection: 'commentsLikes'})