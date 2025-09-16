import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator"; // Import express-validator
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";
import Parent from "../models/Parent.js";
import ClassModel from "../models/Class.js";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";

// @desc    Create student profile  (Simplified, user creation handled in userController)
// @route   POST /api/students
// @access  Private/Admin
const createStudent = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  // Validation rules
  body("admissionNumber")
    .notEmpty()
    .withMessage("Admission number is required"),
  body("rollNumber").notEmpty().withMessage("Roll number is required"),
  body("class")
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("dateOfBirth").isISO8601().withMessage("Invalid date of birth").toDate(),
  body("gender").notEmpty().withMessage("Gender is required"),
  body("parentInfo.guardian")
    .notEmpty()
    .withMessage("Guardian is required")
    .isMongoId()
    .withMessage("Invalid Parent Id"),
  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.state").notEmpty().withMessage("State is required"),
  body("address.postalCode").notEmpty().withMessage("Postal code is required"),
  body("address.country").notEmpty().withMessage("Country is required"),
  body("documents").optional().isArray().withMessage("Documents must be array"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"])
    .withMessage("Invalid Status"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      admissionNumber,
      rollNumber,
      class: classId,
      dateOfBirth,
      gender,
      parentInfo,
      address,
      academicHistory,
      medicalInfo,
      documents,
      status,
    } = req.body;
    //Check if class exist
    const classExist = await ClassModel.findById(classId);
    if (!classExist) {
      return errorResponse(res, "Class not found", 404);
    }
    //Check if parent exist
    const parentExist = await Parent.findById(parentInfo.guardian);
    if (!parentExist) {
      return errorResponse(res, "Parent not found", 404);
    }

    // Check for existing student with the same admission number
    const existingStudent = await Student.findOne({ admissionNumber });
    if (existingStudent) {
      return errorResponse(res, "Admission number already exists", 400);
    }

    // Create the student profile (assuming user is already created)
    const student = await Student.create({
      user: req.body.userId, // Assuming userId is passed from user creation
      admissionNumber,
      rollNumber,
      class: classId,
      dateOfBirth,
      gender,
      parentInfo,
      address,
      academicHistory,
      medicalInfo,
      documents,
      status: status || "ACTIVE", // Default status
    });
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "STUDENT_CREATED",
      description: `Created student profile for ${student.admissionNumber}`,
      context: "student-management", // Added context
      metadata: { studentId: student._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(
      res,
      student,
      "Student profile created successfully",
      201
    );
  }),
];

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, Teacher, Student (self), Parent)
const getStudentById = [
  protect,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
      .populate("class", "name section")
      .populate("user", "firstName lastName email")
      .populate("parentInfo.guardian", "firstName lastName contactNumber");

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Authorization check (Admin, Teacher of the student's class, the student themselves, or the student's parent)
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      !(
        req.user.role === "TEACHER" &&
        student.class.equals(req.user.assignedClasses)
      ) && // Assuming assignedClasses in Teacher model
      !(
        req.user.role === "STUDENT" &&
        req.user._id.toString() === student.user.toString()
      ) &&
      !(
        req.user.role === "PARENT" &&
        student.parentInfo.guardian.equals(req.user._id)
      )
    ) {
      return errorResponse(res, "Not authorized to view this student", 403);
    }
    return successResponse(res, student, "Student data retrieved successfully");
  }),
];

// @desc    Get students by class
// @route   GET /api/students/class/:classId
// @access  Private (Admin, Teacher)
const getStudentsByClass = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), // Only admins and teachers can access
  asyncHandler(async (req, res) => {
    const classId = req.params.classId;
    const classData = await ClassModel.findById(classId);

    if (!classData) {
      return errorResponse(res, "Class not found", 404);
    }

    // If the user is a teacher, they can only access the class if they are the class teacher
    if (req.user.role === "TEACHER") {
      if (
        !classData.classTeacher.equals(req.user._id) &&
        !classData.subjects.some((subject) =>
          subject.assignedTeachers.includes(req.user._id)
        )
      ) {
        return errorResponse(res, "Unauthorized to access this class", 403);
      }
    }

    const students = await Student.find({ class: classId })
      .populate("class", "name section")
      .populate("user", "firstName lastName email");
    return successResponse(res, students, "Students retrieved successfully");
  }),
];

// @desc    Update student profile
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  upload.array("documents"), // Handle multiple document uploads

  // Validation rules (optional updates)
  body("admissionNumber")
    .optional()
    .notEmpty()
    .withMessage("Admission number is required"),
  body("rollNumber")
    .optional()
    .notEmpty()
    .withMessage("Roll number is required"),
  body("class")
    .optional()
    .notEmpty()
    .withMessage("Class is required")
    .isMongoId()
    .withMessage("Invalid Class Id"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth")
    .toDate(),
  body("gender").optional().notEmpty().withMessage("Gender is required"),
  body("parentInfo.guardian")
    .optional()
    .notEmpty()
    .withMessage("Guardian is required")
    .isMongoId()
    .withMessage("Invalid Parent ID"),
  body("address.street")
    .optional()
    .notEmpty()
    .withMessage("Street is required"),
  body("address.city").optional().notEmpty().withMessage("City is required"),
  body("address.state").optional().notEmpty().withMessage("State is required"),
  body("address.postalCode")
    .optional()
    .notEmpty()
    .withMessage("Postal code is required"),
  body("address.country")
    .optional()
    .notEmpty()
    .withMessage("Country is required"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"])
    .withMessage("Invalid Status"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    const {
      admissionNumber,
      rollNumber,
      class: classId,
      dateOfBirth,
      gender,
      parentInfo,
      address,
      academicHistory,
      medicalInfo,
      status,
    } = req.body;

    // Check if class exists if a new class ID is provided
    if (classId) {
      const classExists = await ClassModel.findById(classId);
      if (!classExists) {
        return errorResponse(res, "Class not found", 404);
      }
    }
    // Check if parent exists if a new parent ID is provided
    if (parentInfo && parentInfo.guardian) {
      const parentExist = await Parent.findById(parentInfo.guardian);
      if (!parentExist) {
        return errorResponse(res, "Parent not found", 404);
      }
    }

    // Handle document uploads
    let updatedDocuments = [...student.documents]; // Start with existing documents

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.buffer, {
          folder: "student_documents",
          public_id: `${student.admissionNumber}_${Date.now()}`, // Unique ID
        });
        return {
          type: file.mimetype, // Store the file type
          name: file.originalname,
          url: result.secure_url,
          uploadedAt: new Date(),
        };
      });

      const newDocuments = await Promise.all(uploadPromises);
      updatedDocuments = [...updatedDocuments, ...newDocuments]; // Add new documents
    }

    // Prepare the update object
    const updateData = {
      admissionNumber: admissionNumber || student.admissionNumber,
      rollNumber: rollNumber || student.rollNumber,
      class: classId || student.class,
      dateOfBirth: dateOfBirth || student.dateOfBirth,
      gender: gender || student.gender,
      parentInfo: parentInfo || student.parentInfo,
      address: address || student.address,
      academicHistory: academicHistory || student.academicHistory,
      medicalInfo: medicalInfo || student.medicalInfo,
      documents: updatedDocuments, // Use updated documents array
      status: status || student.status,
    };

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "STUDENT_UPDATED",
      description: `Updated student profile for ${updatedStudent.admissionNumber}`,
      context: "student-management", // Added context
      metadata: { studentId: updatedStudent._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(
      res,
      updatedStudent,
      "Student profile updated successfully"
    );
  }),
];

// @desc    Delete student profile
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Delete associated documents from Cloudinary
    if (student.documents && student.documents.length > 0) {
      const deletePromises = student.documents.map((doc) => {
        const publicId = doc.url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(publicId);
      });

      try {
        await Promise.all(deletePromises);
      } catch (error) {
        console.error("Error deleting student documents:", error);
        //  Log the error, but don't necessarily fail the entire request
      }
    }

    await Student.deleteOne({ _id: req.params.id });

    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "STUDENT_DELETED",
      description: `Deleted student profile for ${student.admissionNumber}`,
      context: "student-management", // Added context
      metadata: { studentId: student._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, null, "Student removed");
  }),
];

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin, Teacher
const getStudents = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"),
  asyncHandler(async (req, res) => {
    const students = await Student.find()
      .populate("user", "firstName lastName email")
      .populate("class", "name section")
      .populate("parentInfo.guardian", "contactNumber")
      .lean();

    return successResponse(res, students, "Students retrieved successfully");
  }),
];

export {
  createStudent,
  getStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent,
};
