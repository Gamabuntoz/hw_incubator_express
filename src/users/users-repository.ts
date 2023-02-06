import {usersCollection} from "../db/db";
import {userType} from "../db/types";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add";

export const usersRepository = {
    async createUser(user: userType): Promise<userType> {
        let newUser = await usersCollection.insertOne(user)
        return user
    },
    async findUserByLoginOrEmail(loginOrEmail: string) {
        const foundUser = await usersCollection.findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
        return foundUser
    },
    async findUserByConfirmationCode(code: string) {
        const foundUser = await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return foundUser
    },
    async deleteUser(userId: ObjectId): Promise<boolean> {
        const result = await usersCollection.deleteOne({_id: userId})
        return result.deletedCount === 1
    },
    async deleteAllUsers(): Promise<boolean> {
        const result = await usersCollection.deleteMany({})
        return result.deletedCount === 1
    },
    async updateConfirmation(id: ObjectId): Promise<boolean> {
        let result = await usersCollection.updateOne({_id: id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    },
    async resendConfirmation(id: ObjectId): Promise<boolean> {
        const newCode = uuidv4()
        const newDate = add(new Date(), {
            hours: 1,
            minutes: 1
        })
        let result = await usersCollection.updateOne({_id: id}, {$set: {"emailConfirmation.confirmationCode": newCode, "emailConfirmation.expirationDate": newDate}})
        return result.modifiedCount === 1
    }
}