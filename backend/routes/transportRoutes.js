// routes/transportRoutes.js
import express from "express";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  assignStudent,
  removeStudent,
  getStudentRoute,
} from "../controllers/transportController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// GET /api/transport/students/:studentId/route - Find which route a student is on
router
  .route("/students/:studentId/route")
  .get(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    getStudentRoute
  );

// GET /api/transport/routes - Get all routes
// POST /api/transport/routes - Create a new route
router
  .route("/routes")
  .get(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    getRoutes
  )
  .post(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    createRoute
  );

// POST /api/transport/routes/:id/students - Assign a student to a route
router
  .route("/routes/:id/students")
  .post(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    assignStudent
  );

// DELETE /api/transport/routes/:id/students/:studentId - Remove a student from a route
router
  .route("/routes/:id/students/:studentId")
  .delete(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    removeStudent
  );

// GET /api/transport/routes/:id - Get route by ID
// PUT /api/transport/routes/:id - Update route
// DELETE /api/transport/routes/:id - Delete route
router
  .route("/routes/:id")
  .get(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    getRouteById
  )
  .put(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    updateRoute
  )
  .delete(
    protect,
    authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
    setSchoolId,
    deleteRoute
  );

export default router;
