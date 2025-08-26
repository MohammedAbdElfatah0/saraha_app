import Joi from "joi";

export function validation(Schema) {
    return (req, res, next) => {
        const { error } = Schema.validate(req.body);
        if (error) {
            let errorMessage = error.details.map((err) => { return err.message }).join(', ');
            console.error(`Validation error: ${errorMessage}`);
            return res.status(400).json({ message: errorMessage });
        }
        next();
    };
}

export const generateValidation = {
    fullName: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    confirmPassword: (ref) => Joi.string().valid(Joi.ref(ref)),// Ensure confirmPassword matches password
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    dob: Joi.date().less('now'),
    otp: Joi.number()
}