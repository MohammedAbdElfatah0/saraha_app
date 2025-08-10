
import nodemailer from "nodemailer";
export async function sendEmail({ to, subject, html }) {
    const transport = nodemailer.createTransport({
        service: "",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "",//todo .env 
            pass: ""//todo .env 
        }
    });
    await transport.sendMail({
        from: "'saraha'<>",
        to,
        subject,
        html,

    })
};