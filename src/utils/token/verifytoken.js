import jwt from "jsonwebtoken";

export function verifyTokenAccount(token) {

  return jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded) // { userId: "...", iat: ..., exp: ... }

}
