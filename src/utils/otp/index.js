/**
 * 
 * @param {*} expireTime -in millisecond 
 * @returns object {otp,otpExpiration}
 */


export function generateOtp(expireTime = 2 * 60 * 1000) {
    const otp = Math.floor(Math.random() * 90000 + 10000).toString();
    const otpExpiration = Date.now() + expireTime;
    return { otp, otpExpiration };
} 