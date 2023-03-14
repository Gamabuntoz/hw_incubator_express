import {usersRepository} from "./users-repository";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt"
import {UserModelClass} from "../db/db"
import {allUsersUIType, userUIType} from "../db/UI-types";

export const usersService = {
    async findUserById(userId: ObjectId): Promise<userUIType | null> {
        const result = await UserModelClass.findOne({_id: userId})
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
    async findAllUsers(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number, searchLoginTerm: string, searchEmailTerm: string): Promise<allUsersUIType> {
        let filter = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter = {
                $or: [{login: {$regex: searchLoginTerm, $options: "$i"}},
                    {email: {$regex: searchEmailTerm, $options: "$i"}}]
            }
        }
        let sort = "createdAt"
        if (sortBy) {
            sort = sortBy
        }
        const totalCount = await UserModelClass.countDocuments(filter)
        const findAll = await UserModelClass
            .find(filter)
            .sort({[sort]: sortDirection === "asc" ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
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
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}