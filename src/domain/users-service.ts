import {usersRepository} from "../repositories/users-repository";
import {Filter, ObjectId} from "mongodb";
import {findUsersType, usersType} from "../repositories/types/types";
import bcrypt from "bcrypt"
import {usersCollection} from "../repositories/db";

export const usersService ={
    async findAllUsers(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, searchLoginTerm: string, searchEmailTerm: string): Promise<findUsersType> {
        const filter: Filter<usersType> = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter.login = {$regex: searchLoginTerm, $options: "$i"}
            filter.email = {$regex: searchEmailTerm, $options: "$i"}
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
                    login: u.login,
                    email: u.email,
                    createdAt: u.createdAt
                })
            )
        }
    },
    async createUser(login: string, password: string, email: string): Promise<usersType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: usersType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
        }
        return usersRepository.createUser(newUser)
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
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordHash.slice(7, 28))
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}