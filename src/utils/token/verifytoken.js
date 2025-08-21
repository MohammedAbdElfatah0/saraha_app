import jwt from "jsonwebtoken";

export function verifyTokenAccount(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded) // { userId: "...", iat: ..., exp: ... }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
