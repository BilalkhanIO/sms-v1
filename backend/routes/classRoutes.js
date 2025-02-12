// routes/classRoutes.js
import express from "express";
import {
  createClass,
  addStudentToClass,
} from "../controllers/classController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, admin, createClass);

router.route("/:id/students").put(protect, admin, addStudentToClass);

export default router;
