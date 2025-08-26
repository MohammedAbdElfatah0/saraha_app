
import Joi from 'joi';
import { generateValidation } from '../../middleware/validation.js';
export const registerSchema = Joi.object(
    {
        fullName: generateValidation.fullName.required(),
        email: generateValidation.email.required(),
        password: generateValidation.password.required(),
        confirmPassword: generateValidation.confirmPassword('password').required(),// Ensure confirmPassword matches password
        phoneNumber: generateValidation.phoneNumber.required(),
        dob: generateValidation.dob.required(),

    }
).or('email', 'phoneNumber'); // At least one of email or phoneNumber must be provided


export const loginSchema = Joi.object(
    {
        phoneNumber: generateValidation.phoneNumber,
        email: generateValidation.email,
        password: generateValidation.password.required(),
    }
).or('email', 'phoneNumber'); // At least one of email or phoneNumber must be provided


export const verifyAccountSchema = Joi.object(
    {
        email: generateValidation.email,
        otp: generateValidation.otp
    }
).required();

export const resendOtpSchema = Joi.object(
    {
        email: generateValidation.email
    }
).required();

export const forgetPasswordSchema = Joi.object(
    {
        email: generateValidation.email,
        otp: generateValidation.otp,
        newPassword: generateValidation.password,
        confirmPassword: generateValidation.confirmPassword("newPassword")
    }
).required();