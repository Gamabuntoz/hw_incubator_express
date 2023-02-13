import jwt from "jsonwebtoken"
import {deviceAuthSessionsType, userType} from "../db/types";
import {authSessionsCollection, settings} from "../db/db";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid"

export const jwtService = {
    async createAccessJWT(user: userType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: 10})
    },
    async createRefreshJWT(user: userType, deviceId: string) {
        return jwt.sign({userId: user._id, deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: 20})
    },

    async authSessionInfo(refreshToken: string, userId: string, userIpAddress: string, deviceName: string, deviceId: string) {
        let decodeToken: any
        try {
            decodeToken = jwt.verify(refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        const sessionInfo: deviceAuthSessionsType = {
            issueAt: decodeToken.iat.toString(),
            expiryAt: decodeToken.exp.toString(),
            ipAddress: userIpAddress,
            deviceName: deviceName,
            userId: userId,
            deviceId: deviceId
        }
        return await authSessionsCollection.insertOne(sessionInfo)
    },
    async findAuthSession(refreshToken: string) {
        let decodeToken: any
        try {
            decodeToken = jwt.verify(refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        const issueAt = decodeToken.iat.toString()
        return await authSessionsCollection.findOne({issueAt: issueAt})
    },
    async findAuthSessionByDeviceId(deviceId: ObjectId) {
        return await authSessionsCollection.findOne({_id: deviceId})
    },
    async findAllUserSessions(userId: string) {
        return authSessionsCollection.find({userId: userId})
    },
    async deleteAuthSession(refreshToken: string) {
        let decodeToken: any
        try {
            decodeToken = jwt.verify(refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        const issueAt = decodeToken.iat.toString()
        const result = await authSessionsCollection.deleteOne({issueAt: issueAt})
        return result.deletedCount === 1
    },
    async deleteAuthSessionByDeviceId(deviceId: ObjectId) {
        const result = await authSessionsCollection.deleteOne({_id: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllAuthSession(refreshToken: string) {
        let decodeToken: any
        try {
            decodeToken = jwt.verify(refreshToken, settings.JWT_SECRET)
        } catch (e) {
            return null
        }
        const issueAt = decodeToken.iat.toString()
        const result = await authSessionsCollection.deleteMany({issueAt: {$ne: issueAt}})
        return result.deletedCount === 1
    },
    async checkRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return {
                userId: new ObjectId((result.userId)),
                deviceId: result.deviceId
            }
        } catch (error) {
            return null
        }
    }
}