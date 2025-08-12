
import nodemailer from "nodemailer";
export async function sendEmail({ to, subject, html }) {
    const transport = nodemailer.createTransport({
        // host: process.env.EMAIL_HOST , // todo env
        service: process.env.EMAIL_SERVICE , // todo env
        port: process.env.EMAIL_PORT , // todo env
        secure:true,
        auth: {
            user: process.env.USER_EMAIL,//todo .env 
            pass: process.env.PASSWORD_EMAIL,//todo .env 
        }
    });
    await transport.sendMail({
        from: "'saraha App'<hamo02abdelfatah@gmail.com>",
        to,
        subject,
        html, 
    })
};