// D:/Projects/sms-v1/backend/utils/generateToken.js

import jwt from "jsonwebtoken";

const generateToken = (id) => {
  // Ensure you have a JWT_SECRET in your environment variables
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;
