import {Router} from 'express';
import * as userService from './user.service.js';
import { fileUpLoad } from '../../utils/multer/index.js';
const userRouter = Router();
userRouter.delete("/delete/:userId", userService.deleteAccount);
userRouter.get("/getUser", userService.getUser);
userRouter.put("/updatePassword", userService.updataPassword);
//upload image local in disk:::
userRouter.post("upload-picture",fileUpLoad().single("profilePicture"),userService.upLoadPicture);
export default userRouter;