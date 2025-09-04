import { Router } from 'express';
import { validation } from '../../middleware/validation.js';
import { messageSchemaValidation } from './message.validation.js';
import { fileUpload } from './../../utils/multer/multer.cloud.js';
import *as messageService from './message.service.js';
import { isAuthenticated } from './../../middleware/authentication-middleware.js';
const messageRouter = Router();
///*url -> /message/id
messageRouter.post("/:receiver",
     fileUpload().array("attachments", 2),
     validation(messageSchemaValidation),
     messageService.sendMessage);
// *url -> /message/id/sender
messageRouter.post("/:receiver/sender",
     isAuthenticated,
     fileUpload().array("attachments", 2),
     validation(messageSchemaValidation),
     messageService.sendMessage);

messageRouter.get("/:id", isAuthenticated, messageService.getMessages);
export default messageRouter;