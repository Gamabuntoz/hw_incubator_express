import jwt from "jsonwebtoken"
import {deviceAuthSessionsType, userType} from "../db/types";
import {authSessionsCollection, settings} from "../db/db";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createAccessJWT(user: userType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: "1h"})
    },
    async createRefreshJWT(user: userType, deviceId: string, issueAt: number) {
        return jwt.sign({userId: user._id, deviceId: deviceId, issueAt: issueAt}, settings.JWT_SECRET, {expiresIn: settings.EXPIRATION_JWT_REFRESH_TOKEN})
    },

    async insertDeviceInfo(device: deviceAuthSessionsType) {
        return await authSessionsCollection.insertOne(device)
    },
    async updateDeviceInfo(oldIssueAt: number, newIssueAt: number) {
        const result = await authSessionsCollection.updateOne({issueAt: oldIssueAt}, {issueAt: newIssueAt})
        return result.modifiedCount === 1
    },
    async findDeviceByDate(issueAt: number) {
        return await authSessionsCollection.findOne({issueAt: issueAt})
    },
    async findDeviceByDeviceId(deviceId: string) {
        return await authSessionsCollection.findOne({deviceId: deviceId})
    },
    async findAllUserSessions(userId: string) {
        return authSessionsCollection.find({userId: userId}).toArray()
    },
    async deleteDevice(issueAt: number) {
        const result = await authSessionsCollection.deleteOne({issueAt: issueAt})
        return result.deletedCount === 1
    },
    async deleteAuthSessionByDeviceId(deviceId: string) {
        const result = await authSessionsCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllUserDeviceExceptCurrent(issueAt: number, userId: ObjectId) {
        const result = await authSessionsCollection.deleteMany({issueAt: {$ne: issueAt}, userId: userId})
        return result.deletedCount === 1
    },
    async checkRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return {
                userId: result.userId,
                deviceId: result.deviceId,
                issueAt: result.issueAt
            }
        } catch (error) {
            return null
        }
    },
    async deleteAllAuthSessionAllUsers() {
        const result = await authSessionsCollection.deleteMany({})
        return result.deletedCount === 1
    },
}