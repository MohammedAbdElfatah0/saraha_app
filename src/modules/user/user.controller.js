import {Router} from 'express';
import * as userService from './user.service.js';
const userRouter = Router();
userRouter.delete("/delete/:userId", userService.deleteAccount);
userRouter.get("/getUser", userService.getUser);
userRouter.put("/updatePassword", userService.updataPassword);
export default userRouter;