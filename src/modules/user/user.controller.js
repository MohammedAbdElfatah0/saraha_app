import { Router } from 'express';
import * as userService from './user.service.js';
import { fileUpLoad } from '../../utils/multer/index.js';
import { fileValidation } from '../../middleware/file_validation_middleware.js';
import { isAuthenticated } from '../../middleware/authentication-middleware.js';

const userRouter = Router();
userRouter.delete("/delete/:userId", userService.deleteAccount);
userRouter.get("/profile", userService.getUser);
userRouter.put("/updatePassword", userService.updataPassword);
//upload image local in disk:::
userRouter.post("/upload-picture",
    isAuthenticated,
    fileUpLoad(["image/png", "image/jpeg"]).single("profilePicture"),
    fileValidation({ allowType: ["image/png", "image/jpeg"] }),
    userService.upLoadPicture);
export default userRouter;