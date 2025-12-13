import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
export function fileUpload({
    folder,
    allowedType = ["image/png", "image/jpeg"],
    fileSize = 1048576
} = {}
) {
    const storage = diskStorage({
        // destination: "uploads",
        destination: (req, file, cd) => {
            let destination = `uploads/${folder}/${req.user._id}`

            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true });
            }
            cd(null, destination)
        },

        filename: (req, file, cb) => {
            cb(null, nanoid(5) + "_" + file.originalname);
        },

    }
    );//storage
    //
    const fileFilter = (req, file, cb) => {
        if (allowedType.includes(file.mimetype)) {

            cb(null, true);
        } else {

            cb(new Error("inValid format file type ", { cause: 400 },),);
        }
    };// filter

    const limits = { fileSize: fileSize };//limits size 
    /**
     * limits: {
                fileSize: 5 * 1024 * 1024, // 5 MB
                fieldSize: 2 * 1024 * 1024, // حجم أقصى للحقل نفسه
                files: 3, // أقصى عدد ملفات يترفعوا
                fields: 10, // أقصى عدد حقول عادية
            }
     */

    return multer({ fileFilter, storage, limits });
}