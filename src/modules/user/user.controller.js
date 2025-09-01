import { Router } from 'express';
import * as userService from './user.service.js';
import {  fileUpload } from '../../utils/multer/index.js';
import { fileValidation } from '../../middleware/file_validation_middleware.js';
import { isAuthenticated } from '../../middleware/authentication-middleware.js';
import { fileUpload as fileUploadCloud} from './../../utils/multer/multer.cloud.js';

const userRouter = Router();
userRouter.delete("/delete", isAuthenticated, userService.deleteAccount);
userRouter.get("/profile", isAuthenticated, userService.getProfile)
userRouter.put("/updatePassword", isAuthenticated, userService.updataPassword);// todo:::want validation
//upload image local in disk:::
userRouter.post("/upload-picture",
    isAuthenticated,//auth middleware
    fileUpload({ folder: "profile_picture", allowType: ["image/png", "image/jpeg"] }).single("profilePicture"),
    fileValidation({ allowType: ["image/png", "image/jpeg"] }),
    userService.upLoadPicture);

//upload image cloud
userRouter.post("/uploads-picture-cloud",
    isAuthenticated,
    fileUploadCloud().single("profilePicture"),
    userService.upLoadPictureCloud
);
export default userRouter;