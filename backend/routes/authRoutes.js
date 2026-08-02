import express from "express";
import {
  loginUser,
  logoutUser,
  refreshTokenHandler,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenHandler);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
