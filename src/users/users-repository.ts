import {UserModelClass} from "../db/db";
import {userDBType} from "../db/DB-types";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add";

export const usersRepository = {
    async createUser(user: userDBType): Promise<userDBType> {
        const userInstance = new UserModelClass(user)

        userInstance._id = user._id
        userInstance.accountData = user.accountData
        userInstance.emailConfirmation = user.emailConfirmation
        userInstance.passwordRecovery = user.passwordRecovery

        await userInstance.save()
        return user
    },
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return UserModelClass.findOne({$or: [{"accountData.login": loginOrEmail}, {"accountData.email": loginOrEmail}]})
    },
    async findUserById(id: ObjectId) {
        return UserModelClass.findOne({_id: id})
    },
    async findUserByConfirmationCode(code: string) {
        return UserModelClass.findOne({"emailConfirmation.confirmationCode": code})
    },
    async findUserByRecoveryCode(code: string) {
        return UserModelClass.findOne({"passwordRecovery.code": code})
    },
    async deleteUser(id: ObjectId): Promise<boolean> {
        const userInstance = await UserModelClass.findOne({_id: id})
        if (!userInstance) return false
        userInstance.deleteOne()
        return true
    },
    async updateConfirmation(id: ObjectId): Promise<boolean> {
        const userInstance = await UserModelClass.findOne({_id: id})
        if (!userInstance) return false
        userInstance.emailConfirmation.isConfirmed = true
        await userInstance.save()
        return true
    },
    async resendConfirmation(id: ObjectId): Promise<boolean> {
        const newCode = uuidv4()
        const newDate = add(new Date(), {
            hours: 1,
            minutes: 1
        })
        const userInstance = await UserModelClass.findOne({_id: id})
        if (!userInstance) return false
        userInstance.emailConfirmation.confirmationCode = newCode
        userInstance.emailConfirmation.expirationDate = newDate
        await userInstance.save()
        return true
    },
    async createPasswordRecoveryCode(id: ObjectId): Promise<boolean> {
        const code = uuidv4()
        const date = add(new Date(), {
            hours: 1,
            minutes: 1
        })
        const userInstance = await UserModelClass.findOne({_id: id})
        if (!userInstance) return false
        userInstance.passwordRecovery.code = code
        userInstance.passwordRecovery.expirationDate = date
        await userInstance.save()
        return true
    },
    async updatePassword(id: ObjectId, passwordHash: string): Promise<boolean> {
        const userInstance = await UserModelClass.findOne({_id: id})
        if (!userInstance) return false
        userInstance.accountData.passwordHash = passwordHash
        await userInstance.save()
        return true
    },
}