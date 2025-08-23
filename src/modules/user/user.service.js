
import jwt from 'jsonwebtoken';
import { User } from './../../DB/models/user.model.js';
import { comparePassword, hashPassword } from "../../utils/security/hashing.js";
import { verifyTokenAccount } from '../../utils/token/index.js';

export const deleteAccount = async (req, res, next) => {
    const { userId } = req.params;

    console.log("User ID to delete:", userId);
    const deleteAccount = await User.findByIdAndDelete(userId);
    //take id from token buffer and delete the user check if role the user is really user not anther role
    // todo::

    if (!deleteAccount) {
        throw new Error("User not found ", { cause: 404 });
    }
    return res.status(200).json({ message: 'User deleted successfully', success: true });
};

export const getUser = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error("Authorization header is required", { cause: 400 });
    }
    // const token = authorization.split(" ")[1]; when using buffer
    const token = authorization;
    const decoded = verifyTokenAccount(token);
    if (decoded.error) {
        throw new Error("Invalid token", { cause: 401 });
    }
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    return res.status(200).json({ user, success: true });
};

export const updataPassword = async (req, res, next) => {
    const { authorization, oldpassword, newpassword } = req.headers;

    if (!authorization) {
        throw new Error("Authorization header is required", { cause: 400 });
    }


    console.log("request headers:", req.headers);
    console.log("Old Password:", oldpassword);
    console.log("New Password:", newpassword);
    if (!oldpassword || !newpassword) {
        throw new Error("Old password and new password are required", { cause: 400 });
    }
    // const token = authorization.split(" ")[1]; when using buffer
    const token = authorization;
    const decoded = verifyTokenAccount(token);
    if (decoded.error) {
        throw new Error("Invalid token", { cause: 401 });
    }
    const userExist = await User.findById(decoded.userId);
    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
    }
    // Check if the old password is correct
    const isPasswordValid = comparePassword(oldpassword, userExist.password);
    if (!isPasswordValid) {
        throw new Error("Invalid old password", { cause: 401 });
    }
    // Update the password
    userExist.password = hashPassword(newpassword); // Assuming you have a method to hash the password
    await userExist.save();
    return res.status(200).json({ message: 'Password updated successfully', success: true });


}

export const upLoadPicture = async (req, res, next) => {
    console.log(req.user);
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