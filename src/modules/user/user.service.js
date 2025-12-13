import { User } from './../../DB/models/user.model.js';
import { comparePassword, hashPassword } from "../../utils/security/hashing.js";
import fs from "fs";
import { deleteFolder, uploadfile } from '../../utils/cloud/cloudinary.config.js';
import { decryptData } from '../../utils/security/index.js';
import Token from '../../DB/models/token.model.js';
//delete account
export const deleteAccount = async (req, res, next) => {

    await User.updateOne({ _id: req.user._id }, { deletedAt: Date.now(), credentialUpdatedAt: Date.now() });
    await Token.deleteMany({ userId: req.user._id });// controller for refresh token
    const user = req.user;
    //delete from cloudinary

    if (req.user.profilePicture.public_id) {
        await deleteFolder({ folder: `saraha_app/user/${user._id}` });
    }


    //delete from db
    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ message: 'User deleted successfully', success: true });
};
//get profile
export const getProfile = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }, {}, { populate: { path: "messages" }}).lean();
    const phoneNumber = decryptData(req.user.phoneNumber);
    return res.status(200).json({ message: "done", success: true, user: { ...user, phoneNumber } });
};
//updata password
export const updataPassword = async (req, res, next) => {
    const { oldpassword, newpassword } = req.headers;
    if (!oldpassword || !newpassword) {
        throw new Error("Old password and new password are required", { cause: 400 });
    }
    const userExist = req.user;
    // Check if the old password is correct
    const isPasswordValid = comparePassword(oldpassword, userExist.password);
    if (!isPasswordValid) {
        throw new Error("Invalid old password", { cause: 401 });
    }


    await User.findByIdAndUpdate(
        req.user._id,
        {
            password: hashPassword(newpassword),
            credentialUpdatedAt: Date.now(),
        },
    );
    return res.status(200).json({ message: 'Password updated successfully', success: true });

};
//upload picture  local 
//if you want it work change of  model user 
export const upLoadPicture = async (req, res, next) => {

    //delete old picture from system and db
    if (req.user.profilePicture) {
        fs.unlinkSync(req.user.profilePicture);
    }

    const userExist = await User.findByIdAndUpdate(req.user._id,
        {
            profilePicture: req.file.path,
        },
        {
            new: true
        },
    );
    if (!userExist) {
        throw new Error("user not found", { cause: 404 });
    }
    return res.status(201).json({
        message: "upload picture successfully",
        success: true,
        data: userExist.profilePicture
    });

};
//upload picture cloud
export const upLoadPictureCloud = async (req, res, next) => {
    //get data from req
    const user = req.user;
    const file = req.file;
    const { public_id, secure_url } = await uploadfile(
        {
            path: file.path,
            options: { folder: `saraha_app/user/${user._id}/profile_picture` }
        })

    //updata to db 
    await User.updateOne({ _id: user._id }, {
        profilePicture: { secure_url, public_id }
    });
    return res.status(200).json({ message: "profile picture successfully", success: true, data: { secure_url } })
};