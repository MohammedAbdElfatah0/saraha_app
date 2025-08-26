import multer, { diskStorage } from "multer";
export function fileUpLoad({
    folder,
    allowedType = ["image/png", "image/jpeg"],
    fileSize = 1048576
} = {}
) {
    const storage = diskStorage({});//storage
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

    // console.log("done upload image ")
    return multer({ fileFilter, storage, limits });
}