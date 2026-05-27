// routes/userRoutes.js
import express from "express";
const router = express.Router();
import {
  getUsers,
  getProfile,
  updateUserProfile,
  updateUserRole,
  createUser,
  deleteUser,
  getUserById,
  updateUser,
  updateUserStatus,
  getMyProfile,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";
import { logActivity } from '../middleware/auditLogMiddleware.js';

// GET /api/users - Get all users (Admin only)
router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  setSchoolId,
  getUsers
);

// GET /api/users/my-profile - Get logged-in user's profile
router.get("/my-profile", protect, getMyProfile);

// PUT /api/users/profile - Update logged-in user's profile
router.put("/profile", protect, updateUserProfile);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put(
  "/:id/role",
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  logActivity('USER_UPDATE', 'User'),
  updateUserRole
);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  logActivity('USER_UPDATE', 'User'),
  updateUserStatus
);

// POST /api/users - Create a new user (Admin only)
router.post("/", protect, authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), logActivity('USER_CREATE', 'User'), createUser);

// DELETE /api/users/:id - Delete a user (Admin only)
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  logActivity('USER_DELETE', 'User'),
  deleteUser
);

// GET /api/users/:id - Get user by ID (Admin or the user themselves)
router.get("/:id", protect, getUserById); // Authorization handled within controller

// PUT /api/users/:id - Update a user (Admin only)
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  logActivity('USER_UPDATE', 'User'),
  updateUser
);

export default router;
