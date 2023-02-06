import nodemailer from "nodemailer";
import {userType} from "../db/types";

export const emailAdapter = {
    async sendEmail(user: userType) {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "bonypiper@gmail.com",
                pass: "zfzmivezoxwgectq",
            },
        });
        let result = await transporter.sendMail({
            from: "bonypiper@gmail.com",
            to: user.accountData.email,
            subject: "Registration",
            text: user.emailConfirmation.confirmationCode,
        });
        return result
    }
}