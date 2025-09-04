import Joi from "joi";
import { generateValidation } from "../../middleware/validation.js";
const messageSchemaValidation=Joi.object({
    content:generateValidation.content,
    receiver:generateValidation.objectId.required(),
});
export {messageSchemaValidation};