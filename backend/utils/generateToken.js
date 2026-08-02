import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(40).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return { token, hashedToken, expires };
};

// Legacy default export kept for any remaining direct imports
export default generateAccessToken;
