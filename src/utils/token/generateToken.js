import jwt from "jsonwebtoken";
import RefreshToken from "../../DB/models/refresh.token.model.js";

export async function generateToken(user) {
    const accessToken = jwt.sign(user,// user ID solo is best and when using login search by id and chack email or phone number,with password
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION //todo env 
    });
    const refreshToken = jwt.sign(user,
        process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION //todo env
    });
    await RefreshToken.create({
        userId: user.userId, // Assuming user object has a userId property
        token: refreshToken
    })
    return { accessToken, refreshToken };
}