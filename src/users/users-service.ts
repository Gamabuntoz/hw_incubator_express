import {usersRepository} from "./users-repository";
import {ObjectId} from "mongodb";
import {findUsersType, findUserType, userType} from "../db/types";
import bcrypt from "bcrypt"
import {usersCollection} from "../db/db"
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

export const usersService = {
    async findUserById(userId: ObjectId): Promise<findUserType | null> {
        const result = await usersCollection.findOne({_id: userId})
        if (!result) {
            return null
        }
        return {
            id: result._id!.toString(),
            login: result.accountData.login,
            email: result.accountData.email,
            createdAt: result.accountData.createdAt
        }
    },
    async findAllUsers(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, searchLoginTerm: string, searchEmailTerm: string): Promise<findUsersType> {
        let filter = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: searchLoginTerm, $options: "$i"}}, {
                    email: {
                        $regex: searchEmailTerm,
                        $options: "$i"
                    }
                }]
            }
        }
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await usersCollection.countDocuments(filter)
        const findAll = await usersCollection
            .find(filter)
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: findAll.map(u => ({
                    id: u._id!.toString(),
                    login: u.accountData.login,
                    email: u.accountData.email,
                    createdAt: u.accountData.createdAt
                })
            )
        }
    },
    async createUser(login: string, password: string, email: string): Promise<findUserType | null> {
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
        return {
            id: result._id!.toString(),
            login: result.accountData.login,
            email: result.accountData.email,
            createdAt: result.accountData.createdAt
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        let userId: ObjectId;
        try {
            userId = new ObjectId(id)
        } catch (e) {
            console.log(e)
            return false
        }
        return usersRepository.deleteUser(userId)
    },
    async deleteAllUsers(): Promise<boolean> {
        return usersRepository.deleteAllUsers()
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<userType | boolean> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.accountData.passwordHash!.slice(0, 29))
        if (user.accountData.passwordHash !== passwordHash) {
            return false
        }
        return user
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}