import Token from "../DB/models/token.model.js";
import { User } from "../DB/models/user.model.js";
import { verifyTokenAccess } from "../utils/token/verifytoken.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new Error("token is required", { cause: 401 });
    }
    const payload = verifyTokenAccess(token);

    const blockToken = await Token.findOne({ token, type: "access" });
    if (blockToken) {
        throw new Error("invalid Token", { cause: 401 });

    }
    const userExists = await User.findById(payload.userId).select("-password").lean();//format json


    if (!userExists) {
        throw new Error("user is not found ", { cause: 404 });

    }


    if (userExists.credentialUpdatedAt > new Date(payload.iat)) {
        throw new Error("Token expired", { cause: 401 });

    }
    req.user = userExists;
    next();
}