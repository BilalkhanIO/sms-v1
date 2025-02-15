import express from "express";
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
} from "../controllers/classController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, admin, getClasses).post(protect, admin, createClass); // GET all, POST new
router
    .route("/:id")
    .get(protect, getClassById) // GET one
    .put(protect, admin, updateClass) // PUT update
    .delete(protect, admin, deleteClass); // DELETE one

router
    .route("/:id/students")
    .put(protect, admin, addStudentToClass); // PUT add student

router
    .route("/:id/students/:studentId")
    .delete(protect, admin, removeStudentFromClass); // DELETE remove student

export default router;