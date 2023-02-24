import {authDeviceDBType} from "../db/DB-types";
import {DeviceModel} from "../db/db";
import {ObjectId} from "mongodb";

export const devicesRepository = {
    async insertDeviceInfo(device: authDeviceDBType): Promise<authDeviceDBType> {
        return DeviceModel.create(device)
    },
    async updateDeviceInfo(oldIssueAt: number, newIssueAt: number): Promise<boolean> {
        const result = await DeviceModel.updateOne({issueAt: oldIssueAt}, {$set: {issueAt: newIssueAt}})
        return result.matchedCount === 1
    },
    async findDeviceByDate(issueAt: number): Promise<authDeviceDBType | null> {
        return DeviceModel.findOne({issueAt: issueAt})
    },
    async findDeviceByDeviceId(deviceId: string): Promise<authDeviceDBType | null> {
        return DeviceModel.findOne({deviceId: deviceId})
    },
    async findAllUserDevices(userId: string): Promise<authDeviceDBType[] | null> {
        return DeviceModel.find({userId: userId}).lean()
    },
    async deleteDevice(issueAt: number): Promise<boolean> {
        const result = await DeviceModel.deleteOne({issueAt: issueAt})
        return result.deletedCount === 1
    },
    async deleteAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await DeviceModel.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllUserDeviceExceptCurrent(issueAt: number, userId: ObjectId): Promise<boolean> {
        const result = await DeviceModel.deleteMany({issueAt: {$ne: issueAt}, userId: userId})
        return result.deletedCount === 1
    },
    async deleteAllAuthSessionAllUsers() {
        return DeviceModel.deleteMany({})
    }
}