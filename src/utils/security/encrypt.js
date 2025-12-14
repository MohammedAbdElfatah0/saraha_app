import CryptoJS from "crypto-js";

const key = process.env.SECRET_KEY ;
console.log(key[0],key[2])//_@
export function encryptData(data) {
    return CryptoJS.AES.encrypt(data,key).toString();// Encrypt the data

}

export function decryptData(encryptedData) {
    return CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8); // Decrypt the data
}