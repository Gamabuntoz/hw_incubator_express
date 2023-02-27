import nodemailer from "nodemailer";
import {userDBType} from "../db/DB-types";

const senderData = {
    service: "gmail",
    auth: {
        user: "bonypiper@gmail.com",
        pass: "zfzmivezoxwgectq",
    }
}

export const emailAdapter = {
    async sendEmail(user: userDBType) {
        let transporter = nodemailer.createTransport(senderData);
        let result = await transporter.sendMail({
            from: "SAMURAIS-API, <bonypiper@gmail.com>",
            to: user.accountData.email,
            subject: "Registration",
            html: `<h1>Thank for your registration</h1>
            <p>To finish registration please follow the link below:
            <a href='https://incubator-hw.vercel.app/registration-confirmation?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
            </p>`,
        });
        return result
    },
    async sendEmailForPasswordRecovery(user: userDBType) {
        let transporter = nodemailer.createTransport(senderData);
        let result = await transporter.sendMail({
            from: "SAMURAIS-API, <bonypiper@gmail.com>",
            to: user.accountData.email,
            subject: "Password Recovery",
            html: `<h1>Password recovery</h1>
                        <p>To finish password recovery please follow the link below:
                           <a href='https://incubator-hw.vercel.app/password-recovery?recoveryCode=${user.passwordRecovery?.code}'>recovery password</a>
                        </p>`,
        });
        return result
}}