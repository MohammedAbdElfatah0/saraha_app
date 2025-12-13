import jwt from "jsonwebtoken";

export function verifyTokenAccess(token) {

  return jwt.verify(token, process.env.JWT_SECRET_KEY_ACCESS_TOKEN);

}

export function verifyTokenRefresh(token) {

  return jwt.verify(token, process.env.JWT_SECRET_KEY_REFRESH_TOKEN);

}