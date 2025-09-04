import { User } from './../../DB/models/user.model.js';
import { comparePassword, hashPassword } from "../../utils/security/hashing.js";
import fs from "fs";
import cloudinary from '../../utils/cloud/cloudinary.config.js';
import { decryptData } from '../../utils/security/index.js';
import Token from '../../DB/models/token.model.js';
//delete account
export const deleteAccount = async (req, res, next) => {

    await User.updateOne({ _id: req.user._id }, { deletedAt: Date.now(), credentialUpdatedAt: Date.now() });
    await Token.deleteMany({ userId: req.user._id });// controller for refresh token
    const user = req.user;
    //delete from cloudinary

    if (req.user.profilePicture.public_id) {
        await cloudinary.api.delete_resources_by_prefix(`saraha_app/user/${user._id}`);
        await cloudinary.api.delete_folder(`saraha_app/user/${user._id}`);
    }


    //delete from db
    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ message: 'User deleted successfully', success: true });
};
//get profile
export const getProfile = async (req, res, next) => {
    const phoneNumber = decryptData(req.user.phoneNumber);
    return res.status(200).json({ success: true, user: { ...req.user, phoneNumber } });
};
//updata password
export const updataPassword = async (req, res, next) => {
    const { oldpassword, newpassword } = req.headers;
    console.log("Old Password:", oldpassword);
    console.log("New Password:", newpassword);
    if (!oldpassword || !newpassword) {
        throw new Error("Old password and new password are required", { cause: 400 });
    }
    const userExist = req.user;
    // Check if the old password is correct
    const isPasswordValid = comparePassword(oldpassword, userExist.password);
    if (!isPasswordValid) {
        throw new Error("Invalid old password", { cause: 401 });
    }
    // Update the password
    //*why not working -> lean() to object not doc
    // userExist.password = hashPassword(newpassword); // Assuming you have a method to hash the password
    // userExist.credentialUpdatedAt = Date.now();
    // await userExist.save();

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
    const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, {
        folder: `saraha_app/user/${user._id}/profile_picture`,//location file 
        // public_id: user.profilePicture?.public_id//file name
    })

    //updata to db 
    await User.updateOne({ _id: user._id }, {
        profilePicture: { secure_url, public_id }
    });
    return res.status(200).json({ message: "profile picture successfully", success: true, data: { secure_url } })
};