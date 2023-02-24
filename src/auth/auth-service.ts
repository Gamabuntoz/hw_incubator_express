import {usersRepository} from "../users/users-repository";
import {ObjectId} from "mongodb";
import {findUserType, userType} from "../db/DB-types";
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"
import add from "date-fns/add"
import {emailAdapter} from "../application/email-adapters";

export const authService = {
    async createUser(login: string, password: string, email: string): Promise<userType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: userType = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                isConfirmed: false,
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 1
                }),
            }
        }
        const result = await usersRepository.createUser(newUser)
        await emailAdapter.sendEmail(newUser)
        return newUser
    },
    async createUserByAdmin(login: string, password: string, email: string): Promise<findUserType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: userType = {
            _id: new ObjectId(),
            accountData: {
                login: login,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                isConfirmed: true,
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 1
                }),
            }
        }
        await usersRepository.createUser(newUser)
        return {
            id: newUser._id!.toString(),
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    },
    async resendEmail(email: string): Promise<boolean | string> {
        let user = await usersRepository.findUserByLoginOrEmail(email)
        if (!user) return "User dont exist"
        if (user.emailConfirmation.isConfirmed) return "Email already confirmed"
        await usersRepository.resendConfirmation(user._id)
        await usersRepository.findUserByLoginOrEmail(email)
        await emailAdapter.sendEmail(user)
        return true
    },
    async confirmEmail(code: string): Promise<boolean | string> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if (!user) return "User dont exist"
        if (user.emailConfirmation.expirationDate < new Date()) return "Confirmation code was expired"
        if (user.emailConfirmation.isConfirmed) return "Email already confirmed"
        let result = await usersRepository.updateConfirmation(user._id)
        return result
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<userType | boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        if (!user.emailConfirmation.isConfirmed) {
            return false
        }
        const passwordHash = await this._generateHash(password, user.accountData.passwordHash!.slice(0, 29))
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async passwordRecovery(email: string): Promise<boolean | string> {
        let user = await usersRepository.findUserByLoginOrEmail(email)
        if (!user) return false
        await usersRepository.createPasswordRecoveryCode(user._id)
        user = await usersRepository.findUserByLoginOrEmail(email)
        await emailAdapter.sendEmailForPasswordRecovery(user!)
        return true
    },
    async changePasswordAttempt(newPassword: string, recoveryCode: string) {
        let user = await usersRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) return "Invalid code"
        if (user.passwordRecovery!.expirationDate < new Date()) return false
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)
        await usersRepository.updatePassword(user._id, passwordHash)
        return true
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}