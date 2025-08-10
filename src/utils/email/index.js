
import nodemailer from "nodemailer";
export async function sendEmail({ to, subject, html }) {
    const transport = nodemailer.createTransport({
        service: "",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "hamo02abdelfatah@gmail.com",//todo .env 
            pass: "fodbbmpxlholltyx"//todo .env 
        }
    });
    await transport.sendMail({
        from: "'saraha'<hamo02abdelfatah@gmail.com>",
        to,
        subject,
        html,

    })
};