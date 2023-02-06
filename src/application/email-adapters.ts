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
            html: `<h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
            <a href='https://incubator-hw.vercel.app/registration-confirmation?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
            </p>`,
        });
        return result
    }
}