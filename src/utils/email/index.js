
import nodemailer from "nodemailer";
export async function sendEmail({ to, subject, html }) {
    const transport = nodemailer.createTransport({

        service: process.env.EMAIL_SERVICE , 
        port: process.env.EMAIL_PORT ,
        secure:true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASSWORD_EMAIL,
        }
    });
    await transport.sendMail({
        from: "'saraha App'<hamo02abdelfatah@gmail.com>",
        to,
        subject,
        html, 
    })
};