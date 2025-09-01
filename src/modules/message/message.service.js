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