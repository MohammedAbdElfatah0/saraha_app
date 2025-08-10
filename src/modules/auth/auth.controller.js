import { Router } from 'express';
import * as authService from './auth.service.js';
const authRouter = Router();
authRouter.post("/register", authService.register);
authRouter.post("/login", authService.login);
authRouter.post("/verify-Account", authService.verifyAccount);
authRouter.post("/resend-otp", authService.resendOtp);
export default authRouter;