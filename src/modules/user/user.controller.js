import {Router} from 'express';
import * as userService from './user.service.js';
const userRouter = Router();
userRouter.delete("/delete/:userId", userService.deleteAccount);
export default userRouter;