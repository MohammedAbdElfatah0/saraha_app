import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export function fileUpLoad() {
    const storage = diskStorage({
        destination: "uploads", filename: (req, file, cb) => {
            console.log(file);
            cb(null, nanoid(5) + "_" + file.originalname);
        }
    }
    );
    const fileFilter=(req,file,cb)=>{

    };
    return multer({fileFilter,storage});
}