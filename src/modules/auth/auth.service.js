import { sendEmail } from '../../utils/email/index.js';
import { User } from './../../DB/models/user.model.js';
import { generateOtp } from './../../utils/otp/index.js';
import { comparePassword, encryptData, hashPassword, } from '../../utils/security/index.js';
import { generateToken } from '../../utils/token/generateToken.js';
import RefreshToken from '../../DB/models/refresh.token.model.js';
import generateNewAccessToken from './../../utils/token/refreahToken.js';


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
    const user = await User.findOne(
        {
            email,
            otp,
            otpExpiration: { $gt: Date.now() }
        });
    console.log(user);
    if (!user) {
        throw new Error("Invalid otp ", { cause: 401 });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: "Account verify successful", success: true })

};

//resend otp 
export const resendOtp = async (req, res, next) => {

    //get data email,
    const { email } = req.body;
    //generated new otp
    const { otp, otpExpiration } = generateOtp(5 * 60 * 1000);
    //found user exist
    // const userExist = await User.findOne({ email });
    const userExist = await User.updateOne({ email }, { otp, otpExpiration });
    if (!userExist) {
        throw new Error("user not exist", { cause: 401 });
    }
    //updata otp from DB
    // userExist.otp = otp;
    // userExist.otpExpiration = otpExpiration;
    // await userExist.save();

    //send email
    await sendEmail({
        to: email,
        subject: "verify your Account",
        html: `<p> The otp to verify your account is ${otp}:</p>`
    })
    //response
    return res.status(200).json({ message: "resend otp successfully", success: true });
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
            ]
        }
    );


    if (!userExist) {
        throw new Error("User not found", { cause: 404 });
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
    const { refreshToken } = req.headers.authorization;

    if (!refreshToken) {
        throw new Error("Refresh token is required", { cause: 400 });
    }

    // Delete the refresh token from the database
    await RefreshToken.deleteOne({ token: refreshToken });

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