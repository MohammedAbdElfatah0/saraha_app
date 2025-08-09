import { User } from './../../DB/models/user.model.js';
import bcrypt from 'bcrypt';

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
                },]
        }
        );
        if (userExists) {
            // return res.status(400).json({ message: 'User already exists' });
            throw new Error("User already exists", { cause: 409 });
        }


        const user = new User({
            fullName,
            email,
            password:bcrypt.hashSync(password, 10), // Hash the password
            phoneNumber,
            dob
        });
        await user.save();



        return res.status(201).json({ message: 'User registered successfully' });


    } catch (error) {

        return res.status(error.cause || 500).json({ message: error.message, success: false });

    }
}