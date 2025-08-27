import Token from "../../DB/models/token.model.js";
import { signToken } from './signToken.js';


export async function generateToken(user) {
    const payload = { userId: user.userId };

    // Generate tokens
    const accessToken = signToken(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRATION);
    const refreshToken = signToken(payload, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);

    // Save new refresh token
    await Token.create({ userId: user.userId, token: refreshToken, type: "refresh" });
    return { accessToken, refreshToken };
}
