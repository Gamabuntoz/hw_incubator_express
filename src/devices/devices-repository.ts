import {authDeviceDBType} from "../db/DB-types";
import {DeviceModelClass} from "../db/db";
import {ObjectId} from "mongodb";

export const devicesRepository = {
    async insertDeviceInfo(device: authDeviceDBType): Promise<authDeviceDBType> {
        return DeviceModelClass.create(device)
    },
    async updateDeviceInfo(oldIssueAt: number, newIssueAt: number): Promise<boolean> {
        const result = await DeviceModelClass.updateOne({issueAt: oldIssueAt}, {$set: {issueAt: newIssueAt}})
        return result.matchedCount === 1
    },
    async findDeviceByDate(issueAt: number): Promise<authDeviceDBType | null> {
        return DeviceModelClass.findOne({issueAt: issueAt})
    },
    async findDeviceByDeviceId(deviceId: string): Promise<authDeviceDBType | null> {
        return DeviceModelClass.findOne({deviceId: deviceId})
    },
    async findAllUserDevices(userId: string): Promise<authDeviceDBType[] | null> {
        return DeviceModelClass.find({userId: userId}).lean()
    },
    async deleteDevice(issueAt: number): Promise<boolean> {
        const result = await DeviceModelClass.deleteOne({issueAt: issueAt})
        return result.deletedCount === 1
    },
    async deleteAuthSessionByDeviceId(deviceId: string): Promise<boolean> {
        const result = await DeviceModelClass.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    },
    async deleteAllUserDeviceExceptCurrent(issueAt: number, userId: ObjectId): Promise<boolean> {
        const result = await DeviceModelClass.deleteMany({issueAt: {$ne: issueAt}, userId: userId})
        return result.deletedCount === 1
    }
}