import { sendEmail } from '../../utils/email/index.js';
import { User } from './../../DB/models/user.model.js';
import bcrypt from 'bcrypt';
import { generateOtp } from './../../utils/otp/index.js';
import e from 'express';

export const register = async (req, res) => {
    try {
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
            password: bcrypt.hashSync(password, 10), // Hash the password
            phoneNumber,
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


    } catch (error) {

        return res.status(error.cause || 500).json({ message: error.message, success: false, error: error.stack });

    }
} 

export const verifyAccount = async (req, res, next) => {
    try {
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

    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, success: false });
    }
};

//resend otp 
export const resendOtp = async (req, res, next) => {
    try {
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
            to:email,
            subject: "verify your Account",
            html: `<p> The otp to verify your account is ${otp}:</p>`
        })
        //response
        return res.status(200).json({ message: "resend otp successfully", success: true });
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, success: false ,error: error.stack });
    }
};

export const login = async (req, res, next) => {
    const { email, phoneNumber, password } = req.body;
    try {

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
        const isPasswordValid = bcrypt.compareSync(password, userExist.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password", { cause: 401 });
        }

        // todo:
        //generate a token for the user

        //return response
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            //token: token, // Assuming you have a token generation logic 
        });
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, success: false });
    }
};