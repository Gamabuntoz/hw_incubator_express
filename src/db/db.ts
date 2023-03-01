import * as dotenv from "dotenv"
import mongoose from "mongoose";
import {
    adminSchema,
    attemptSchema,
    blogSchema,
    commentLikesSchema,
    commentSchema,
    deviceSchema,
    postSchema,
    userSchema
} from "./schems";

dotenv.config()

export const settings = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://0.0.0.0:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    EXPIRATION_JWT_REFRESH_TOKEN: 2000000
}

if (!settings.MONGO_URI) {
    throw new Error("URL doesn't found")
}

export const PostModelClass = mongoose.model("posts", postSchema)
export const BlogModelClass = mongoose.model("blogs", blogSchema)
export const UserModelClass = mongoose.model("users", userSchema)
export const AdminModelClass = mongoose.model("admin", adminSchema)
export const DeviceModelClass = mongoose.model("devices", deviceSchema)
export const CommentModelClass = mongoose.model("comments", commentSchema)
export const AuthAttemptModelClass = mongoose.model("authAttempts", attemptSchema)
export const CommentLikesModelClass = mongoose.model("commentsLikes", commentLikesSchema)

export async function runDb() {
    try {
        await mongoose.connect(settings.MONGO_URI);
    } catch {
        await mongoose.disconnect();
    }
}