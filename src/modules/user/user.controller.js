import { Router } from 'express';
import * as userService from './user.service.js';
import { fileUpLoad } from '../../utils/multer/index.js';
import { fileValidation } from '../../middleware/file_validation_middleware.js';
import { isAuthenticated } from '../../middleware/authentication-middleware.js';
import { fileUpLoad as fileUploadCloud} from './../../utils/multer/multer.cloud.js';

const userRouter = Router();
userRouter.delete("/delete/:userId", isAuthenticated, userService.deleteAccount);
userRouter.get("/profile", isAuthenticated, userService.getProfile)
userRouter.put("/updatePassword", isAuthenticated, userService.updataPassword);
//upload image local in disk:::
userRouter.post("/upload-picture",
    isAuthenticated,//auth middleware
    fileUpLoad({ folder: "profile_picture", allowType: ["image/png", "image/jpeg"] }).single("profilePicture"),
    fileValidation({ allowType: ["image/png", "image/jpeg"] }),
    userService.upLoadPicture);


userRouter.post("/uploads-picture-cloud",
    isAuthenticated,
    fileUploadCloud().single("profilePicture"),
    userService.upLoadPictureCloud
);
export default userRouter;