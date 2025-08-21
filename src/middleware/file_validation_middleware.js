import fs from 'fs';
import { fileTypeFromBuffer } from "file-type";
export function fileValidation({ allowType }) {
    console.log("start");
    return async (req, res, next) => {
        const filePath = req.file.path;
        // console.log(filePath);
        const buffer = fs.readFileSync(filePath);
        // console.log(buffer);
        const type = await fileTypeFromBuffer(buffer);
        // console.log(type);
        if (!type || !allowType.includes(type.mime)) {
            return next(new Error("inValid  format file type"));
        }
        console.log("done file validation");
        return next();
    };
}