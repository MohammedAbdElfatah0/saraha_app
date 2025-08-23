
import Joi from 'joi';
export const registerSchema = Joi.object(
    {
        fullName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),// Ensure confirmPassword matches password
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
        dob: Joi.date().less('now').required(),

    }
).or('email', 'phoneNumber'); // At least one of email or phoneNumber must be provided


export const loginSchema = Joi.object(
    {
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        email: Joi.string().email(),
        password: Joi.string().min(5).required(),
    }
).or('email', 'phoneNumber'); // At least one of email or phoneNumber must be provided


export const verifyAccount = Joi.object(
    {
        email: Joi.string().email(),
        otp: Joi.number()
    }
).required();

export const resendOtp = Joi.object(
    {
        email: Joi.string().email()
    }
).required();