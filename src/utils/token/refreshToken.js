import jwt from "jsonwebtoken";
import RefreshToken from "../../DB/models/refresh.token.model.js";
import { signToken } from "./signToken.js";

async function generateNewAccessToken(refreshTokenValue) {


    const savedToken = await RefreshToken.findOne({ token: refreshTokenValue });

    if (!savedToken) {
        throw new Error("No refresh token found for this user", { cause: 401 });
    }

    const decoded = jwt.verify(savedToken.token, process.env.JWT_REFRESH_SECRET);

    if (!decoded || !decoded.userId) {
        throw new Error("Invalid or expired token payload", { cause: 401 });
    }
    const accessToken = signToken(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRATION
    )

    return {
        accessToken,
    };
}

export default generateNewAccessToken;
