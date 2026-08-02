import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import User from "../models/User.js";
import Parent from "../models/Parent.js";
import Teacher from "../models/Teacher.js";
import ClassModel from "../models/Class.js";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";

// @desc    Create student profile  (Simplified, user creation handled in userController)
// @route   POST /api/students
// @access  Private/Admin
const createStudent = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("admissionNumber").notEmpty().withMessage("Admission number is required"),
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
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED", "SUSPENDED"])
    .withMessage("Invalid Status"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      firstName,
      lastName,
      email,
      password,
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

    const classExist = await ClassModel.findById(classId);
    if (!classExist) return errorResponse(res, "Class not found", 404);

    const parentExist = await Parent.findById(parentInfo.guardian);
    if (!parentExist) return errorResponse(res, "Parent not found", 404);

    const existingStudent = await Student.findOne({ admissionNumber });
    if (existingStudent) return errorResponse(res, "Admission number already exists", 400);

    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResponse(res, "Email already in use", 400);

    // Create the User account for this student
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "STUDENT",
      school: req.schoolId,
      status: "ACTIVE",
    });

    let student;
    try {
      student = await Student.create({
        user: user._id,
        school: req.schoolId,
        admissionNumber,
        rollNumber,
        class: classId,
        dateOfBirth,
        gender,
        parentInfo,
        address,
        academicHistory,
        medicalInfo,
        status: status || "ACTIVE",
      });
    } catch (err) {
      // Roll back the user if student creation fails
      await User.findByIdAndDelete(user._id);
      throw err;
    }

    await Activity.logActivity({
      userId: req.user._id,
      type: "STUDENT_CREATED",
      description: `Created student profile for ${student.admissionNumber}`,
      context: "student-management",
      metadata: { studentId: student._id },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const populated = await student.populate("user", "firstName lastName email");
    return successResponse(res, populated, "Student created successfully", 201);
  }),
];

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (Admin, Teacher, Student (self), Parent)
const getStudentById = [
  protect,
  asyncHandler(async (req, res) => {
    const student = await Student.findOne({
      _id: req.params.id,
      school: req.schoolId,
    })
      .populate("class", "name section")
      .populate("user", "firstName lastName email")
      .populate({ path: "parentInfo.guardian", select: "user contactNumber", populate: { path: "user", select: "firstName lastName" } });

    if (!student) {
      return errorResponse(res, "Student not found", 404);
    }

    // Authorization check (Admin, Teacher of the student's class, the student themselves, or the student's parent)
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      !(req.user.role === "TEACHER") &&
      !(
        req.user.role === "STUDENT" &&
        req.user._id.toString() === student.user.toString()
      ) &&
      !(
        req.user.role === "PARENT" && student.parentInfo?.guardian?.equals(req.user._id)
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
    const classData = await ClassModel.findOne({
      _id: classId,
      school: req.schoolId,
    });

    if (!classData) {
      return errorResponse(res, "Class not found", 404);
    }

    if (req.user.role === "TEACHER") {
      const teacher = await Teacher.findOne({ user: req.user._id });
      const isClassTeacher = teacher && classData.classTeacher.equals(teacher._id);
      const teachesInSchedule = classData.schedule?.some((day) =>
        day.periods?.some((p) => p.teacher?.equals(teacher?._id))
      );
      if (!isClassTeacher && !teachesInSchedule) {
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

    const student = await Student.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

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
    const student = await Student.findOne({
      _id: req.params.id,
      school: req.schoolId,
    });

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
    const students = await Student.find({ school: req.schoolId })
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
