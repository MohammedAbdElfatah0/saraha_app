import Token from "../../DB/models/token.model.js";

import { generateToken, verifyTokenRefresh } from "../token/index.js";


export const globalErrorHandle = async (err, req, res, next) => {
    // when token was expired error want refresh token..
    if (err.message === "jwt expired") {



        const refresh = req.headers.refreshtoken

        if (!refresh) {
            return res.status(401).json({ success: false, message: "Refresh token required" });
        }

        const payload = verifyTokenRefresh(refresh);
        const tokenExists = await Token.findOneAndDelete({
            token: refresh,
            userId: payload.userId,
            type: 'refresh'
        });//{}|null

        //null when db haven't refresh token -> throw error
        if (!tokenExists) {
            res.status(401).json({
                success: false,
                message: "invalid refresh Token",
                error: err.stack,
            })//logout all device
        }
        //new token access and refresh
        const { accessToken, refreshToken } = await generateToken(payload);

        //res
        res.status(200).json({ message: "refresh Token successfully", success: true, token: { accessToken, refreshToken } });
    }



    if (req.file) {
        fs.unlinkSync(req.file.path)
    }
    res.status(err.cause || 500).json({
        success: false,
        message: err.message,
        error: err.stack,
    })
};