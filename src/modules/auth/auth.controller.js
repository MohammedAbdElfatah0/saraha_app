import { Router } from 'express';
import { register } from './auth.service.js';
const authRouter = Router();
authRouter.post("/register", register)
export default authRouter;