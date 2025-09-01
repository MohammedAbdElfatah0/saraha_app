import CryptoJS from "crypto-js";

const key = process.env.ENCRYPTION_KEY ;
export function encryptData(data) {
    return CryptoJS.AES.encrypt(data,key).toString();// Encrypt the data

}

export function decryptData(encryptedData) {
    return CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8); // Decrypt the data
}