import jwt from "jsonwebtoken"
import {userType} from "../db/types";
import {blockedTokensCollection, settings} from "../db/db";
import {ObjectId} from "mongodb";
import {tr} from "date-fns/locale";

export const jwtService = {
    async createAccessJWT(user: userType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10})
    },
    async createRefreshJWT(user: userType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 20})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId((result.userId))
        } catch (error) {
            return null
        }
    },
    async blockOldRefreshToken(refreshToken: string) {
        const blockedToken = {
            value: refreshToken
        }
        return await blockedTokensCollection.insertOne(blockedToken)
    },
    async checkRefreshToken(token: string) {
        const checkToken = await blockedTokensCollection.findOne({value: token})
        if (checkToken) {
            return null
        }
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId((result.userId))
        } catch (error) {
            return null
        }
    }
}