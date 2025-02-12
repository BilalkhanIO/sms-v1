// routes/userRoutes.js
import express from "express";
import {
  getProfile,
  updateProfile,
  getUsers,
  updateUserRole,
  createUser
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, admin, getUsers).post(createUser);

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

router.route("/:id/role").put(protect, admin, updateUserRole);

export default router;
