import { Router } from 'express';
import * as authService from './auth.service.js';
import { validation } from '../../middleware/validation.js';
import *as schemaValidation from './auth.validation.js';
import { fileUpLoad } from './../../utils/multer/index.js';
import { isAuthenticated } from '../../middleware/authentication-middleware.js';
const authRouter = Router();
authRouter.post("/register",
    validation(schemaValidation.registerSchema),
    fileUpLoad().none(),//parsing data body 
    authService.register);
authRouter.post("/login", validation(schemaValidation.loginSchema), authService.login);
authRouter.post("/verify-Account", validation(schemaValidation.verifyAccount), authService.verifyAccount);
authRouter.post("/resend-otp", validation(schemaValidation.resendOtp), authService.resendOtp);
authRouter.post("/refresh-token", authService.refreshToken);
authRouter.post("/logout",isAuthenticated, authService.logout);//validation
export default authRouter;