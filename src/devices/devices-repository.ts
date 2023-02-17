import {deviceAuthSessionsType} from "../db/types";
import {authDeviceCollection} from "../db/db";
import {ObjectId} from "mongodb";

export const devicesRepository = {
    async insertDeviceInfo(device: deviceAuthSessionsType) {
        return await authDeviceCollection.insertOne(device)
    },
    async updateDeviceInfo(oldIssueAt: number, newIssueAt: number) {
        return await authDeviceCollection.updateOne({issueAt: oldIssueAt}, {$set: {issueAt: newIssueAt}})
    },
    async findDeviceByDate(issueAt: number) {
        return await authDeviceCollection.findOne({issueAt: issueAt})
    },
    async findDeviceByDeviceId(deviceId: string) {
        return await authDeviceCollection.findOne({deviceId: deviceId})
    },
    async findAllUserDevices(userId: string) {
        return await authDeviceCollection.find({userId: userId}).toArray()
    },
    async deleteDevice(issueAt: number) {
        const result = await authDeviceCollection.deleteOne({issueAt: issueAt})
        return result.deletedCount === 1
    },
    async deleteAuthSessionByDeviceId(deviceId: string) {
        const result = await authDeviceCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllUserDeviceExceptCurrent(issueAt: number, userId: ObjectId) {
        const result = await authDeviceCollection.deleteMany({issueAt: {$ne: issueAt}, userId: userId})
        return result.deletedCount === 1
    },
    async deleteAllAuthSessionAllUsers() {
        const result = await authDeviceCollection.deleteMany({})
        return result.deletedCount === 1
    }
}