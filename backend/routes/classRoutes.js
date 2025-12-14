// routes/classRoutes.js
import express from 'express';
const router = express.Router();
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { setSchoolId } from '../middleware/schoolMiddleware.js';

// GET /api/classes - Get all classes (Admin, Teacher, Student)
// POST /api/classes - Create a new class (Admin only)
router
  .route("/")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT"),
    setSchoolId,
    getClasses
  )
  .post(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    createClass
  );

// GET /api/classes/:id - Get class by ID (Admin, Teacher, Student)
// PUT /api/classes/:id - Update class (Admin only)
// DELETE /api/classes/:id - Delete class (Admin only)
router
  .route("/:id")
  .get(protect, setSchoolId, getClassById)
  .put(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    updateClass
  )
  .delete(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    deleteClass
  );

export default router;