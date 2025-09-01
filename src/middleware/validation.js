import Joi from "joi";

export function validation(Schema) {
    return (req, res, next) => {
        let data = { ...req.body, ...req.query, ...req.params };
        const { error } = Schema.validate(data, { abortEarly: false });
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
    otp: Joi.number(),
    objectId: Joi.string().hex().length(24),
    content: Joi.string().min(3).max(1000),
}