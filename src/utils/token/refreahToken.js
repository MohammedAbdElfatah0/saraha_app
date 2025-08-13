import jwt from "jsonwebtoken";
import RefreshToken from "../../DB/models/refresh.token.model.js";

async function generateNewAccessToken(refreshTokenValue) {
  

    const savedToken = await RefreshToken.findOne({ token: refreshTokenValue });
  
    if (!savedToken) {
        throw new Error("No refresh token found for this user");
    }

    let decoded;
    try {
        decoded = jwt.verify(savedToken.token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired refresh token");
    }
    if (!decoded || !decoded.userId) {
        throw new Error("Invalid token payload");
    }
    const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );

    return {
        accessToken: newAccessToken,
    };
}

export default generateNewAccessToken;
