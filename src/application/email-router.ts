import {Request, Response, Router} from "express";
import {emailAdapter} from "./email-adapters";

export const emailRouter = Router({})

emailRouter.post("send", async (req: Request, res: Response) => {
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    await emailAdapter.sendEmail(email, subject, message)
})