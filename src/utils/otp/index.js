/**
 * 
 * @param {*} expireTime -in millisecond 
 * @returns object {otp,otpExpiration}
 */


export function generateOtp(expireTime = 15 * 60 * 1000) {
    const otp = Math.floor(Math.random() * 90000 + 10000);
    const otpExpiration = Date.now() + expireTime;
    return { otp, otpExpiration };
} 