import {blogsCollection, usersCollection} from "./db";
import {usersArrayType, usersType} from "./types/types";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(user: usersType): Promise<usersType | null> {
        let newUser = await usersCollection.insertOne(user)
        return user
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const foundUser = await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }]})
        return foundUser
    },
    async deleteUser(userId: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: userId})
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.deletedCount === 1
    }
}