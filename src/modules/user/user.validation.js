
import Joi from 'joi';
import { generateValidation } from '../../middleware/validation.js';

export const updatePasswordValidation = Joi.object({
    oldpassword: generateValidation.password.required(),
    newPassword: generateValidation.password.required(),
    confirmPassword: generateValidation.confirmPassword('newPassword').required(),
});
