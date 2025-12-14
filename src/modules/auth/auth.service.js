import { sendEmail } from '../../utils/email/index.js';
import { User } from './../../DB/models/user.model.js';
import { generateOtp } from './../../utils/otp/index.js';
import { comparePassword, decryptData, encryptData, hashPassword, } from '../../utils/security/index.js';
import { generateNewAccessToken, generateToken } from '../../utils/token/index.js';
import Token from '../../DB/models/token.model.js';


export const register = async (req, res) => {

    //get the user data from the request body
    const { fullName, email, password, phoneNumber, dob } = req.body;
    //check if the user already exists
    const userExists = await User.findOne({
        $or: [
            {
                $and: [
                    { email: { $exists: true } },
                    { email: { $ne: null } },
                    { email }
                ]
            },
            {
                $and: [
                    { phoneNumber: { $exists: true } },
                    { phoneNumber: { $ne: null } },
                    { phoneNumber }
                ]
            },
        ]
    }
    );
    if (userExists) {
        throw new Error("User already exists", { cause: 409 });
    }


    const user = new User({
        fullName,
        email,
        password: hashPassword(password),
        phoneNumber: encryptData(phoneNumber),
        dob
    });

    const { otp, otpExpiration } = generateOtp(5 * 60 * 1000);
    user.otp = encryptData(otp);
    user.otpExpiration = otpExpiration;


    await sendEmail({
        to: email,
        subject: "verify your Account",
        html: `<h1>Welcome to our service, ${fullName}!</h1>
            <p>Thank you for registering. The otp to verify your account is ${otp}:</p>`
    })


    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
}

export const verifyAccount = async (req, res, next) => {
    const { email, otp } = req.body;
    //TODO:dencrypr otp
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    if (user.verifyAccount === true) {
        throw new Error("Account already confirmed", { cause: 200 });
    }

    if (user.isBanned && user.banExpiration > Date.now()) {
        return res.status(403).json({
            message: "Too many failed attempts. Try again later.",
            success: false,
        });
    }

    if (decryptData(user.otp) !== otp || user.otpExpiration < Date.now()) {
        user.failedAttempts += 1;

        if (user.failedAttempts >= 5) {
            user.isBanned = true;
            user.banExpiration = Date.now() + 10 * 60 * 1000;
        }
        await user.save();
        return res.status(401).json({ message: "Invalid or expired OTP", success: false });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    user.failedAttempts = undefined;
    user.isBanned = undefined;
    user.banExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: "Account verify successful", success: true });
};

export const resendOtp = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not exist", { cause: 401 });
    // check ban
    if (user.isBanned && user.banExpiration > Date.now()) {
        return res.status(403).json({
            message: "You are temporarily banned. Try again later.",
            success: false,
        });
    }

    // reset ban if expired
    if (user.isBanned && user.banExpiration < Date.now()) {
        user.failedAttempts = 0;
        user.isBanned = false;
        user.banExpiration = undefined;
    }

    // check if otp still valid
    if (decryptData(user.otp) && user.otpExpiration > Date.now()) {
        const timeLeft = Math.floor((user.otpExpiration - Date.now()) / 1000);
        await sendEmail({
            to: email,
            subject: "already sent",
            html: `<p>Your OTP is still valid: <b>${decryptData(user.otp)}</b>. It will expire in ${timeLeft} seconds.</p>`,
        });

        return res.status(400).json({
            message: `OTP already sent. Still valid for ${timeLeft} seconds.`,
            success: false,
        });
    }

    // generate new otp if expired
    const { otp, otpExpiration } = generateOtp(2 * 60 * 1000); // 2 minutes
    user.otp = encryptData(otp);
    user.otpExpiration = otpExpiration;

    await user.save();

    await sendEmail({
        to: email,
        subject: "Verify your Account",
        html: `<p>The new OTP to verify your account is <b>${otp}</b></p>`,
    });

    return res.status(200).json({ message: "New OTP generated and sent successfully", success: true });
};

export const login = async (req, res, next) => {
    const { email, phoneNumber, password } = req.body;

    const userExist = await User.findOne(
        {
            $or: [
                {
                    $and: [
                        { email: { $exists: true } },
                        { email: { $ne: null } },
                        { email }
                    ]
                },
                {
                    $and: [
                        { phoneNumber: { $exists: true } },
                        { phoneNumber: { $ne: null } },
                        { phoneNumber }
                    ]
                },
            ],
            isVerified: true
        }
    );


    if (!userExist) {
        throw new Error("User not found  or not confirmed", { cause: 404 });
    }


    const isPasswordValid = comparePassword(password, userExist.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password", { cause: 401 });
    }
    if (userExist.deletedAt) {
        userExist.deletedAt = undefined;
        await userExist.save();
    }

    const { accessToken, refreshToken } = await generateToken({ userId: userExist._id.toHexString(), });

    return res.status(200).json({
        message: 'Login successful',
        success: true,
        token: {
            accessToken,
            refreshToken
        },
    });

};

export const logout = async (req, res, next) => {
    const { refreshToken } = req.headers;
    if (!refreshToken) {
        throw new Error("Refresh token is required", { cause: 400 });
    }

    // Delete the refresh token from the database
    const isDelete = await Token.findOneAndDelete({ token: refreshToken });
    if (!isDelete) {
        throw new Error("token not found", { cause: 404 });
    }

    return res.status(200).json({ message: "Logout successful", success: true });
};

export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("Refresh token is required", { cause: 400 });
    }

    const newAccessToken = await generateNewAccessToken(authorization);
    return res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
        token: newAccessToken
    });

};

export const forgetPassword = async (req, res, next) => {

    const { email, otp, newPassword } = req.body;
    //TODO:Dencrypr otp
    //check from userExists 
    const userExists = await User.findOne({ email });
    if (!userExists) {
        res.status(401).json({ message: "user not found", success: false });
    }

    //check otp
    if (otp !== decryptData(userExists.otp)) {
        res.status(401).json({ message: "inValid otp", success: false });
    }
    //check otp expired 
    if (userExists.otpExpiration < Date.now()) {
        res.status(401).json({ message: "otp Expired", success: false });
    }

    await User.updateOne({ email }, {
        password: hashPassword(newPassword),
        otp: '',
        otpExpiration: '',
        credentialUpdatedAt: Date.now()
    });
    await Token.deleteMany({ userId: userExists._id, type: "refresh" });
    res.status(200).json({ message: "successfully updated password", success: true });

}