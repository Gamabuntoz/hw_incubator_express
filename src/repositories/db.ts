import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'
import {blogsType, postsType} from "./types/types";

dotenv.config()

const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";
if (!mongoUri) {
    throw new Error("URL doesn't found")
}
export const client = new MongoClient(mongoUri);
export const postsCollection = client.db().collection<postsType>("posts")
export const blogsCollection = client.db().collection<blogsType>("blogs")
export const usersCollection = client.db().collection("users")
export const adminCollection = client.db().collection("admin")

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