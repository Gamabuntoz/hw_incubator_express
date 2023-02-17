import jwt from "jsonwebtoken"
import {deviceAuthSessionsType, userType} from "../db/types";
import {authDeviceCollection, settings} from "../db/db";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createAccessJWT(user: userType) {
        return jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: "1h"})
    },
    async createRefreshJWT(user: userType, deviceId: string, issueAt: number) {
        return jwt.sign({userId: user._id, deviceId: deviceId, issueAt: issueAt}, settings.JWT_SECRET, {expiresIn: settings.EXPIRATION_JWT_REFRESH_TOKEN})
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
    }
}