import fs from 'fs';
import { fileTypeFromBuffer } from "file-type";
export function fileValidation({ allowType }) {
    return async (req, res, next) => {
        if (!req.file || !req.file.path) {
            return next(new Error("No file uploaded or file path missing"));
        }
        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const type = await fileTypeFromBuffer(buffer);
        if (!type || !allowType.includes(type.mime)) {
            return next(new Error("inValid format file type"));
        }
        return next();
    };
}