import { User } from "../../DB/models/user.model.js";

export const deleteAccount = async (req, res, next) => {
    const { userId } = req.params;
    try {
        console.log("User ID to delete:", userId);
        const deleteAccount = await User.findByIdAndDelete(userId);
        //take id from token buffer and delete the user check if role the user is really user not anther role
        // todo::

        if (!deleteAccount) {
            throw new Error("User not found ", { cause: 404 });
        }
        return res.status(200).json({ message: 'User deleted successfully', success: true });
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, success: false });
    }
};