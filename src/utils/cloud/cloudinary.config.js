import { v2 as cloudinary } from "cloudinary"

///todo :: env
cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    cloud_name: process.env.CLOUD_NAME,
});
export async function uploadfile({ path, options }) {
    return await cloudinary.uploader.upload(path, options);
}
//upload files
export async function uploadFiles({ files, options }) {
    let attachment = [];
    for (const file of files) {
        const { secure_url, public_id } = await uploadfile({ path: file.path, options });
        attachment.push({ secure_url, public_id });
    }
    return attachment;
}
//delete folder ::
export async function deleteFolder({ folder }) {
    await cloudinary.api.delete_all_resources_by_prefix(folder);
    await cloudinary.api.delete_folder(folder);
}

//delete file 
export async function deletefile({ public_id }) {
    return await cloudinary.uploader.destroy(public_id);
}

export default cloudinary;