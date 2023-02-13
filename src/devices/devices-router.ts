import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service";
import {ObjectId} from "mongodb";


export const devicesRouter = Router()

devicesRouter.get("/",
    async (req: Request, res: Response) => {
        let refreshToken
        try {
            refreshToken = req.cookies.refreshToken
        } catch (e) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const userIDbyRefreshToken = await jwtService.checkRefreshToken(refreshToken)
        if (!userIDbyRefreshToken) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const checkSession = await jwtService.findAuthSession(refreshToken)
        if (!checkSession) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const allSessions = await jwtService.findAllUserSessions(userIDbyRefreshToken.toString())
        res.status(sendStatus.OK_200).send(allSessions.map(c => ({
                ip: c.ipAddress,
                title: c.deviceName,
                lastActiveDate: c.issueAt,
                deviceId: c._id.toString()
            })
        ))
    })
devicesRouter.delete("/",
    async (req: Request, res: Response) => {
        let refreshToken
        try {
            refreshToken = req.cookies.refreshToken
        } catch (e) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const userIDbyRefreshToken = await jwtService.checkRefreshToken(refreshToken)
        if (!userIDbyRefreshToken) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const checkSession = await jwtService.findAuthSession(refreshToken)
        if (!checkSession) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const deleteAllSessions = await jwtService.deleteAllAuthSession(refreshToken)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
devicesRouter.delete("/:id",
    async (req: Request, res: Response) => {
        let deviceId: ObjectId;
        try {
            deviceId = new ObjectId(req.params.id)
        } catch (e) {
            res.sendStatus(sendStatus.NOT_FOUND_404)
            return false
        }
        let refreshToken
        try {
            refreshToken = req.cookies.refreshToken
        } catch (e) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const userIDbyRefreshToken = await jwtService.checkRefreshToken(refreshToken)
        if (!userIDbyRefreshToken) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const checkSession = await jwtService.findAuthSession(refreshToken)
        if (!checkSession) {
            return res.sendStatus(sendStatus.UNAUTHORIZED_401)
        }
        const findSessionById = await jwtService.findAuthSessionByDeviceId(deviceId)
        if (!findSessionById) return res.sendStatus(sendStatus.NOT_FOUND_404)
        if (findSessionById.userId !== userIDbyRefreshToken) return res.sendStatus(sendStatus.FORBIDDEN_403)
        const deleteAllSessions = await jwtService.deleteAuthSessionByDeviceId(deviceId)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })