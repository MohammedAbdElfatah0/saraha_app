import jwt from "jsonwebtoken";

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { userId: "...", iat: ..., exp: ... }
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
