// routes/leaveRoutes.js
import express from "express";
import {
  getLeaveRequests,
  getLeaveById,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/leaves  - Get leave requests (admin sees all; others see own)
// POST /api/leaves - Submit a new leave request (any authenticated user)
router
  .route("/")
  .get(protect, setSchoolId, getLeaveRequests)
  .post(protect, setSchoolId, createLeaveRequest);

// GET    /api/leaves/:id - Get a single leave request
// PUT    /api/leaves/:id - Approve/reject (admin) or cancel (applicant)
// DELETE /api/leaves/:id - Delete if PENDING
router
  .route("/:id")
  .get(protect, setSchoolId, getLeaveById)
  .put(protect, setSchoolId, updateLeaveRequest)
  .delete(protect, setSchoolId, deleteLeaveRequest);

export default router;
