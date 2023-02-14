import {MongoClient} from "mongodb"
import * as dotenv from "dotenv"
import {blogsType, commentsType, postsType, userType} from "./types";

dotenv.config()

export const settings = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://0.0.0.0:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123",
    EXPIRATION_JWT_REFRESH_TOKEN: 3600000
}

if (!settings.MONGO_URI) {
    throw new Error("URL doesn't found")
}
export const client = new MongoClient(settings.MONGO_URI);
export const postsCollection = client.db().collection<postsType>("posts")
export const blogsCollection = client.db().collection<blogsType>("blogs")
export const usersCollection = client.db().collection<userType>("users")
export const adminCollection = client.db().collection("admin")
export const authSessionsCollection = client.db().collection("authSessions")
export const commentsCollection = client.db().collection<commentsType>("comments")

export async function runDb() {
    try {
        await client.connect();
        await client.db().command({ping: 1});
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("Can't connect to db");
        await client.close();
    }
}