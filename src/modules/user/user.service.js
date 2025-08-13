import { User } from "../../DB/models/user.model.js";
import jwt from 'jsonwebtoken';

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
  const decoded=  jwt.verify(token, process.env.JWT_SECRET);
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
