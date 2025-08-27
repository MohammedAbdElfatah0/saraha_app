import jwt from "jsonwebtoken";

export function verifyTokenAccess(token) {

  return jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded) // { userId: "...", iat: ..., exp: ... }

}

export function verifyTokenRefresh(token) {

  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);

}