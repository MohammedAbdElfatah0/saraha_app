
import jwt from "jsonwebtoken";
export function signToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
} 