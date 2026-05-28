// controllers/transportController.js
import Transport from "../models/Transport.js";
import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get all transport routes for the school
// @route   GET /api/transport/routes
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const getRoutes = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const query = { school: req.schoolId };
    if (isActive !== undefined) query.isActive = isActive === "true";

    const routes = await Transport.find(query)
      .populate("assignedStudents", "admissionNumber rollNumber user")
      .sort({ name: 1 })
      .lean();

    return successResponse(res, routes, "Transport routes retrieved successfully");
  }),
];

// @desc    Get a single route by ID
// @route   GET /api/transport/routes/:id
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const getRouteById = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),
  asyncHandler(async (req, res) => {
    const route = await Transport.findOne({
      _id: req.params.id,
      school: req.schoolId,
    })
      .populate("assignedStudents", "admissionNumber rollNumber user")
      .lean();

    if (!route) {
      return errorResponse(res, "Transport route not found", 404);
    }

    return successResponse(res, route, "Transport route retrieved successfully");
  }),
];

// @desc    Create a new transport route
// @route   POST /api/transport/routes
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const createRoute = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("name").notEmpty().withMessage("Route name is required").trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { name, vehicle, stops, monthlyFee, isActive } = req.body;

    const route = await Transport.create({
      name,
      vehicle,
      stops,
      monthlyFee,
      isActive: isActive !== undefined ? isActive : true,
      school: req.schoolId,
      assignedStudents: [],
    });

    return successResponse(res, route, "Transport route created successfully", 201);
  }),
];

// @desc    Update a transport route
// @route   PUT /api/transport/routes/:id
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const updateRoute = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const route = await Transport.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!route) {
      return errorResponse(res, "Transport route not found", 404);
    }

    const { name, vehicle, stops, monthlyFee, isActive } = req.body;

    if (name !== undefined) route.name = name;
    if (vehicle !== undefined) route.vehicle = vehicle;
    if (stops !== undefined) route.stops = stops;
    if (monthlyFee !== undefined) route.monthlyFee = monthlyFee;
    if (isActive !== undefined) route.isActive = isActive;

    const updated = await route.save();
    return successResponse(res, updated, "Transport route updated successfully");
  }),
];

// @desc    Delete a transport route
// @route   DELETE /api/transport/routes/:id
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const deleteRoute = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const route = await Transport.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!route) {
      return errorResponse(res, "Transport route not found", 404);
    }

    await Transport.deleteOne({ _id: route._id });
    return successResponse(res, null, "Transport route deleted successfully");
  }),
];

// @desc    Assign a student to a transport route
// @route   POST /api/transport/routes/:id/students
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const assignStudent = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  body("studentId").notEmpty().withMessage("Student ID is required").isMongoId().withMessage("Invalid student ID"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { studentId } = req.body;

    const route = await Transport.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

    if (!route) {
      return errorResponse(res, "Transport route not found", 404);
    }

    const student = await Student.findOne({ _id: studentId, school: req.schoolId });
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Check if student is already on this route
    if (route.assignedStudents.map((s) => s.toString()).includes(studentId)) {
      return errorResponse(res, "Student is already assigned to this route", 400);
    }

    // Check vehicle capacity
    if (route.vehicle?.capacity && route.assignedStudents.length >= route.vehicle.capacity) {
      return errorResponse(res, "Route has reached vehicle capacity", 400);
    }

    route.assignedStudents.push(studentId);
    await route.save();

    return successResponse(res, route, "Student assigned to route successfully");
  }),
];

// @desc    Remove a student from a transport route
// @route   DELETE /api/transport/routes/:id/students/:studentId
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const removeStudent = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const { id, studentId } = req.params;

    const route = await Transport.findOne({ _id: id, school: req.schoolId });
    if (!route) {
      return errorResponse(res, "Transport route not found", 404);
    }

    const initialLength = route.assignedStudents.length;
    route.assignedStudents = route.assignedStudents.filter(
      (s) => s.toString() !== studentId
    );

    if (route.assignedStudents.length === initialLength) {
      return errorResponse(res, "Student not found on this route", 404);
    }

    await route.save();
    return successResponse(res, route, "Student removed from route successfully");
  }),
];

// @desc    Find which route a student is assigned to
// @route   GET /api/transport/students/:studentId/route
// @access  Private/SCHOOL_ADMIN, SUPER_ADMIN
const getStudentRoute = [
  protect,
  authorize("SCHOOL_ADMIN", "SUPER_ADMIN"),

  asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const student = await Student.findOne({ _id: studentId, school: req.schoolId });
    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const route = await Transport.findOne({
      school: req.schoolId,
      assignedStudents: studentId,
    })
      .populate("assignedStudents", "admissionNumber rollNumber user")
      .lean();

    if (!route) {
      return errorResponse(res, "Student is not assigned to any transport route", 404);
    }

    return successResponse(res, route, "Student transport route retrieved successfully");
  }),
];

export {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  assignStudent,
  removeStudent,
  getStudentRoute,
};
