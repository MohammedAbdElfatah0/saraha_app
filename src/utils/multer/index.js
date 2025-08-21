import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function fileUpLoad(allowedType) {
    const storage = diskStorage({
        destination: "uploads", filename: (req, file, cb) => {
            console.log(file);
            cb(null, nanoid(5) + "_" + file.originalname);
        }
    }
    );
    //
    const fileFilter = (req, file, cb) => {
        if (allowedType.includes(file.mimetype )) {

            cb(null, true);
        } else {

            cb(new Error("inValid format file type ", { cause: 400 },),);
        }
    };
    // console.log("done upload image ")
    return multer({ fileFilter, storage });
}