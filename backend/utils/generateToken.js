// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => { // Corrected: Pass userId and role
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;