
import RefreshToken from "../../DB/models/refresh.token.model.js";
import { signToken } from './signToken.js';


export async function generateToken(user) {
    const payload = { userId: user.userId };

    // Generate tokens
    const accessToken = signToken(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRATION);
    const refreshToken = signToken(payload, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRATION);

    // Remove old refresh token (if exists)
    await RefreshToken.findOneAndDelete({ userId: user.userId });

    // Save new refresh token
    await RefreshToken.create({ userId: user.userId, token: refreshToken });

    return { accessToken, refreshToken };
}
