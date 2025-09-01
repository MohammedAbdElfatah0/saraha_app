import { Router } from 'express';
import * as authService from './auth.service.js';
import { validation } from '../../middleware/validation.js';
import *as schemaValidation from './auth.validation.js';
import {  fileUpload } from './../../utils/multer/index.js';
import { isAuthenticated } from '../../middleware/authentication-middleware.js';
const authRouter = Router();
authRouter.post("/register",
    validation(schemaValidation.registerSchema),
    fileUpload().none(),//parsing data body 
    authService.register);
authRouter.post("/login", validation(schemaValidation.loginSchema), authService.login);
authRouter.post("/verify-Account", validation(schemaValidation.verifyAccountSchema), authService.verifyAccount);
authRouter.post("/resend-otp", validation(schemaValidation.resendOtpSchema), authService.resendOtp);
authRouter.post("/refresh-token", authService.refreshToken);
authRouter.post("/logout", isAuthenticated, authService.logout);//validation
authRouter.patch("/forget-password", validation(schemaValidation.forgetPasswordSchema), authService.forgetPassword);
export default authRouter;