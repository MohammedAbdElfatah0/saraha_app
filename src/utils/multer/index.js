import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "fs";
export function fileUpLoad({
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
            console.log(file);
            cb(null, nanoid(5) + "_" + file.originalname);
        },
        limits: { fileSize: fileSize }//controller size image or file 
    }
    );
    //
    const fileFilter = (req, file, cb) => {
        if (allowedType.includes(file.mimetype)) {

            cb(null, true);
        } else {

            cb(new Error("inValid format file type ", { cause: 400 },),);
        }
    };
    // console.log("done upload image ")
    return multer({ fileFilter, storage });
}