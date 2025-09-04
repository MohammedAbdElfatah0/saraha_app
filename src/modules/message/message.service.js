// import { messageModel } from '../../DB/models/message.model.js';
import { message } from '../../DB/models/message.model.js';
import cloudinary from './../../utils/cloud/cloudinary.config.js';

export const sendMessage = async (req, res, next) => {
    //get data from req
    const { content } = req.body;
    const { receiver } = req.params;
    const { files } = req;



    //upload attachments to cloud 

    //TODO::refactor code
    let attachment = [];
    for (const file of files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            {
                folder: `saraha_app/message/${receiver}/attachment`
            }
        );
        attachment.push({ secure_url, public_id })
    }
    //saving data onto database
    await message.create({
        content,
        receiver,
        attachment,
        sender: req.user?._id
    });
    //response
    res.status(201).json({
        message: 'message sent successfully',
        success: true,
    })
}


export const getMessages = async (req, res, nest) => {
    const { id } = req.params;
    const isMessage = await message.findOne({ _id: id, receiver: req.user._id }, {},
        {
            populate:
                [
                    {
                        path: "receiver",
                        select: "-password -otp -otpExpiration -failedAttempts -isBanned -banExpiration -credentialUpdatedAt -deletedAt -createdAt -updatedAt"
                    }]
        });
    if (!isMessage) {
        throw new Error("message not found", { cause: 404 })
    }
    return res.status(200).json({ message: "message found", success: true, data: { isMessage } })
}