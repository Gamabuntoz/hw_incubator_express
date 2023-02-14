import {Request, Response, Router} from "express";
import {sendStatus} from "../db/status-collection";
import {jwtService} from "../application/jwt-service";
import {authRefreshTokenMiddleware} from "../middlewares/authorization-middleware";


export const devicesRouter = Router()

devicesRouter.get("/devices",
    authRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const checkUserToken = await jwtService.checkRefreshToken(refreshToken)
        const allUserDevices = await jwtService.findAllUserDevices(checkUserToken!.userId)
        res.status(sendStatus.OK_200).send(allUserDevices.map(c => ({
                ip: c.ipAddress,
                title: c.deviceName,
                lastActiveDate: new Date(c.issueAt).toISOString(),
                deviceId: c.deviceId
            })
        ))
    })
devicesRouter.delete("/devices",
    authRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const checkUserToken = await jwtService.checkRefreshToken(refreshToken)
        await jwtService.deleteAllUserDeviceExceptCurrent(checkUserToken!.issueAt, checkUserToken!.userId)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })
devicesRouter.delete("/devices/:id",
    authRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const deviceId = req.params.id
        const refreshToken = req.cookies.refreshToken
        const checkUserToken = await jwtService.checkRefreshToken(refreshToken)
        const findDevice = await jwtService.findDeviceByDeviceId(deviceId)
        if (!findDevice) {
            return res.sendStatus(sendStatus.NOT_FOUND_404)
        }
        if (findDevice.userId !== checkUserToken!.userId) {
            return res.sendStatus(sendStatus.FORBIDDEN_403)
        }
        await jwtService.deleteAuthSessionByDeviceId(deviceId)
        res.sendStatus(sendStatus.NO_CONTENT_204)
    })