import { sendEmail } from '../../utils/email/index.js';
import { User } from './../../DB/models/user.model.js';
import { generateOtp } from './../../utils/otp/index.js';
import { comparePassword, encryptData, hashPassword, } from '../../utils/security/index.js';

import RefreshToken from '../../DB/models/refresh.token.model.js';
import { generateNewAccessToken, generateToken } from '../../utils/token/index.js';


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
        // return res.status(400).json({ message: 'User already exists' });
        throw new Error("User already exists", { cause: 409 });
    }


    const user = new User({
        fullName,
        email,
        password: hashPassword(password), // Hash the password
        phoneNumber: encryptData(phoneNumber), // Encrypt the phone number
        dob
    });
    //generate otp
    const { otp, otpExpiration } = generateOtp(5 * 60 * 1000); // 5 minutes expiration

    user.otp = otp;
    user.otpExpiration = otpExpiration;

    //send verification email
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

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    if (user.verifyAccount === true) {
        throw new Error("Account already confirmed", { cause: 200 });
    }

    // check if user is banned
    if (user.isBanned && user.banExpiration > Date.now()) {
        return res.status(403).json({
            message: "Too many failed attempts. Try again later.",
            success: false,
        });
    }
    console.log("req.body.otp:", otp, typeof otp);
    console.log("user.otp:", user.otp, typeof user.otp);
    console.log("user.otpExpiration:", user.otpExpiration, Date.now());
    //pls send otp as number not string 
    // check OTP validity
    if (user.otp !== otp || user.otpExpiration < Date.now()) {
        user.failedAttempts += 1;

        if (user.failedAttempts >= 5) {
            user.isBanned = true;
            user.banExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes ban
        }
        await user.save();
        return res.status(401).json({ message: "Invalid or expired OTP", success: false });
    }

    // correct otp
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
    //if confirmed ::
    if (user.verifyAccount === true) {
        throw new Error("Account already confirmed", { cause: 200 });
    }
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
    if (user.otp && user.otpExpiration > Date.now()) {
        const timeLeft = Math.floor((user.otpExpiration - Date.now()) / 1000);// take time from db without expire  


        await sendEmail({
            to: email,
            subject: "already sent",
            html: `<p>Your OTP is still valid: <b>${user.otp}</b>. It will expire in ${timeLeft} seconds.</p>`,
        });

        return res.status(400).json({
            message: `OTP already sent. Still valid for ${timeLeft} seconds.`,
            success: false,
        });
    }

    // generate new otp if expired
    const { otp, otpExpiration } = generateOtp(2 * 60 * 1000); // 2 minutes
    user.otp = otp;
    user.otpExpiration = otpExpiration;

    await user.save();

    await sendEmail({
        to: email,
        subject: "Verify your Account",
        html: `<p>The new OTP to verify your account is <b>${otp}</b></p>`,
    });

    return res.status(200).json({ message: "New OTP generated and sent successfully", success: true });
};

// TODO::we need handle if login before check and not login in more
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
            // isVerified: true // Ensure the user is verified
        }
    );


    if (!userExist) {
        throw new Error("User not found ", { cause: 404 });
    }
    if (userExist.verifyAccount == false) {
        throw new Error("The account want confirming ", { cause: 404 });

    }
    /// Check if the password is valid

    const isPasswordValid = comparePassword(password, userExist.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password", { cause: 401 });
    }
    //generate a token for the user
    const { accessToken, refreshToken } = await generateToken({ userId: userExist._id.toHexString(), });
    //return response
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
    const { authorization } = req.headers;
    console.log("Logout Refresh Token:", authorization);
    if (!authorization) {
        throw new Error("-Refresh- token is required", { cause: 400 });
    }

    // Delete the refresh token from the database
    const isDelete = await RefreshToken.findOneAndDelete({ token: authorization });
    if (!isDelete) {
        throw new Error("token not found", { cause: 404 });
    }

    return res.status(200).json({ message: "Logout successful", success: true });
};

export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers;
    console.log("Refresh Token:", authorization);
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
    //get data 1- token 2- otp 3-newPassword 4-email
    const token = req.headers.authorization;
    const { email, otp, newPassword } = req.body;
    //check from userExists 
    const userExists = await User.find({ email });
    if (!userExists) {
        res.status(401).json({ message: "user not found", success: false });
    }
    //check otp
    if (otp != userExists.otp) {
        res.status(401).json({ message: "inValid otp", success: false });
    }
    //check otp expired 
    if (userExists.otpExpiration < Date.now()){
        res.status(401).json({ message: "otp Expired", success: false });
    }
    //* now updata password
    userExists.password=newPassword;
    await userExists.save();
    res.status(200).json({message:"successfully updated password",success:true});

}