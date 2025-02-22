// controllers/teacherController.js
import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import ClassModel from "../models/Class.js";
import Subject from "../models/Subject.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import Activity from "../models/Activity.js";
import cloudinary from "../utils/cloudinary.js"; // Import Cloudinary
import upload from "../utils/multer.js"; // Import Multer

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private/Admin
const getTeachers = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const teachers = await Teacher.find()
      .populate("user", "firstName lastName email") // Populate user details
      .populate("assignedClasses", "name section") // Populate assigned classes
      .populate("assignedSubjects", "name code"); // Populate assigned subjects

    return successResponse(res, teachers, "Teachers retrieved successfully");
  }),
];

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private (Admin, the teacher themselves)
const getTeacherById = [
  protect,
  asyncHandler(async (req, res) => {
    const teacherId = req.params.id;

    // Find the teacher and populate necessary fields
    const teacher = await Teacher.findById(teacherId)
      .populate("user", "firstName lastName email profilePicture") // Populate the user document
      .populate("assignedClasses", "name section") // Populate assigned classes
      .populate("assignedSubjects", "name code"); // Populate assigned subjects

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    // Authorization check: Allow access to admins or the teacher themselves
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user._id.toString() !== teacher.user._id.toString()
    ) {
      return errorResponse(
        res,
        "Not authorized to access this teacher's data",
        403
      );
    }

    return successResponse(res, teacher, "Teacher retrieved successfully");
  }),
];

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private/Admin
const createTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  upload.single("profilePicture"), // Handle profile picture upload

  // Validation rules
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("employeeId").notEmpty().withMessage("Employee ID is required"),
  body("qualification").notEmpty().withMessage("Qualification is required"),
  body("specialization").notEmpty().withMessage("Specialization is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("contactInfo.phone").notEmpty().withMessage("Phone number is required"), // Validate nested fields
  body("dateOfBirth").isISO8601().withMessage("Invalid date of birth format"),
  body("salary").isNumeric().withMessage("Salary must be a number"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const {
      firstName,
      lastName,
      email,
      employeeId,
      qualification,
      specialization,
      address,
      contactInfo,
      dateOfBirth,
      salary,
      documents,
    } = req.body;

    // Check if teacher with the same employee ID already exists
    const teacherExists = await Teacher.findOne({ employeeId });
    if (teacherExists) {
      return errorResponse(
        res,
        "Teacher with this employee ID already exists",
        400
      );
    }

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      let profilePictureUrl = null;
      // Handle profile picture upload
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.buffer, {
          folder: "teacher_profile_pictures", // Optional: Organize uploads in folders
          public_id: `${employeeId}_profile`, // Use a predictable public ID
        });
        profilePictureUrl = result.secure_url;
      }
      // Create a new user
      const user = await User.create(
        [
          {
            // Wrap user creation in an array for transaction
            firstName,
            lastName,
            email,
            password: generateRandomPassword(), // Generate a random password
            role: "TEACHER",
            status: "ACTIVE",
            profilePicture: profilePictureUrl,
          },
        ],
        { session }
      );

      // Create the teacher
      const teacher = await Teacher.create(
        [
          {
            // Wrap teacher creation in an array for transaction
            user: user[0]._id, // Use the newly created user's ID
            employeeId,
            qualification,
            specialization,
            address,
            contactInfo,
            dateOfBirth,
            salary,
            documents,
          },
        ],
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_CREATED",
        description: `Created teacher ${firstName} ${lastName} (${employeeId})`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(
        res,
        {
          _id: teacher[0]._id,
          user: {
            _id: user[0]._id,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            role: user[0].role,
          },
          employeeId: teacher[0].employeeId,
          qualification: teacher[0].qualification,
          specialization: teacher[0].specialization,
        },
        "Teacher created successfully",
        201
      );
    } catch (error) {
      // Abort the transaction if any error occurs
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to create teacher", 500, error.message);
    }
  }),
];

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  upload.single("profilePicture"), // Handle profile picture uploads

  // Validation (allow optional updates)
  body("firstName").optional().notEmpty().withMessage("First name is required"),
  body("lastName").optional().notEmpty().withMessage("Last name is required"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("employeeId")
    .optional()
    .notEmpty()
    .withMessage("Employee ID is required"),
  body("qualification")
    .optional()
    .notEmpty()
    .withMessage("Qualification is required"),
  body("specialization")
    .optional()
    .notEmpty()
    .withMessage("Specialization is required"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .withMessage("Invalid status value"), // Validate enum values
  body("address").optional().notEmpty().withMessage("Address is required"),
  body("contactInfo.phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number is required"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth format"),
  body("salary").optional().isNumeric().withMessage("Salary must be a number"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const {
      firstName,
      lastName,
      email,
      employeeId,
      qualification,
      specialization,
      status,
      address,
      contactInfo,
      dateOfBirth,
      salary,
      assignedClasses,
      assignedSubjects,
      documents,
    } = req.body;

    const teacher = await Teacher.findById(req.params.id).populate("user");

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user information
      let profilePictureUrl = teacher.user.profilePicture; // Keep existing URL by default

      // Handle profile picture updates
      if (req.file) {
        // If there's an existing picture, delete it from Cloudinary first
        if (teacher.user.profilePicture) {
          const publicId = teacher.user.profilePicture
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(
            `teacher_profile_pictures/${publicId}`
          );
        }

        // Upload new profile picture
        const result = await cloudinary.uploader.upload(req.file.buffer, {
          folder: "teacher_profile_pictures",
          public_id: `${employeeId ? employeeId : teacher.employeeId}_profile`,
        });
        profilePictureUrl = result.secure_url;
      }

      // Find and update user in one operation
      const updatedUser = await User.findOneAndUpdate(
        { _id: teacher.user._id },
        {
          firstName: firstName || teacher.user.firstName,
          lastName: lastName || teacher.user.lastName,
          email: email || teacher.user.email,
          profilePicture: profilePictureUrl,
        },
        { new: true, runValidators: true, session }
      );
      const updateData = {
        employeeId: employeeId || teacher.employeeId,
        qualification: qualification || teacher.qualification,
        specialization: specialization || teacher.specialization,
        status: status || teacher.status,
        address: address || teacher.address,
        contactInfo: contactInfo || teacher.contactInfo,
        dateOfBirth: dateOfBirth || teacher.dateOfBirth,
        salary: salary || teacher.salary,
        assignedClasses: assignedClasses || teacher.assignedClasses, // Update assigned classes
        assignedSubjects: assignedSubjects || teacher.assignedSubjects, // Update assigned subjects,
        documents: documents || teacher.documents,
      };
      // Find and update the teacher
      const updatedTeacher = await Teacher.findOneAndUpdate(
        { _id: req.params.id },
        updateData,
        { new: true, runValidators: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_UPDATED",
        description: `Updated teacher ${updatedTeacher.user.firstName} ${updatedTeacher.user.lastName} (${updatedTeacher.employeeId})`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return successResponse(
        res,
        {
          _id: updatedTeacher._id,
          user: {
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
          },
          employeeId: updatedTeacher.employeeId,
          qualification: updatedTeacher.qualification,
          specialization: updatedTeacher.specialization,
        },
        "Teacher updated successfully"
      );
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error); // Log for debugging
      return errorResponse(res, "Failed to update teacher", 500);
    }
  }),
];

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).populate("user");

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      //If there's profile picture, delete it from Cloudinary first
      if (teacher.user.profilePicture) {
        const publicId = teacher.user.profilePicture
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(
          `teacher_profile_pictures/${publicId}`
        );
      }

      // Delete the associated user
      await User.deleteOne({ _id: teacher.user._id }, { session });

      // Delete the teacher
      await Teacher.deleteOne({ _id: req.params.id }, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_DELETED",
        description: `Deleted teacher ${teacher.user.firstName} ${teacher.user.lastName} (${teacher.employeeId})`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, null, "Teacher and associated user removed");
    } catch (error) {
      // Abort the transaction
      await session.abortTransaction();
      session.endSession();
      console.error(error); // Log for debugging
      return errorResponse(res, "Failed to delete teacher", 500);
    }
  }),
];

// @desc    Update teacher status
// @route   PUT /api/teachers/:id/status
// @access  Private/Admin
const updateTeacherStatus = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  // Validate the status
  body("status")
    .isIn(["ACTIVE", "INACTIVE", "SUSPENDED"])
    .withMessage("Invalid status value"),
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { status } = req.body;
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    teacher.status = status;
    const updatedTeacher = await teacher.save();
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "TEACHER_STATUS_UPDATED",
      description: `Updated teacher status to ${status} for ${teacher.employeeId}`,
      context: "teacher-management",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return successResponse(
      res,
      updatedTeacher,
      "Teacher status updated successfully"
    );
  }),
];

// @desc    Get teacher's classes
// @route   GET /api/teachers/:id/classes
// @access  Private (Admin, the teacher themselves)
const getTeacherClasses = [
  protect,
  asyncHandler(async (req, res) => {
    const teacherId = req.params.id;

    // Check if the requesting user is an admin or the teacher themselves
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user._id.toString() !== teacherId
    ) {
      return errorResponse(
        res,
        "Not authorized to access this teacher's classes",
        403
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    const classes = await ClassModel.find({
      $or: [
        { classTeacher: teacherId }, // Classes where the teacher is the class teacher
        { subjects: { $in: teacher.assignedSubjects } }, // Classes where the teacher teaches a subject
      ],
    }).populate("subjects", "name code");

    return successResponse(
      res,
      classes,
      "Teacher's classes retrieved successfully"
    );
  }),
];

// @desc    Get teacher's schedule
// @route   GET /api/teachers/:id/schedule
// @access  Private (Admin, the teacher themselves)
const getTeacherSchedule = [
  protect,
  asyncHandler(async (req, res) => {
    const teacherId = req.params.id;

    // Authorization check
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user._id.toString() !== teacherId
    ) {
      return errorResponse(
        res,
        "Not authorized to access this teacher's schedule",
        403
      );
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    const classes = await ClassModel.find({
      "schedule.periods.teacher": teacherId,
    }).select("name section schedule");

    // Extract and filter the teacher's schedule
    const schedule = classes
      .flatMap((cls) =>
        cls.schedule.map((day) => ({
          day: day.day,
          periods: day.periods.filter(
            (p) => p.teacher && p.teacher.toString() === teacherId
          ),
        }))
      )
      .filter((daySchedule) => daySchedule.periods.length > 0); // Only include days with periods

    return successResponse(
      res,
      schedule,
      "Teacher's schedule retrieved successfully"
    );
  }),
];

// @desc    Assign teacher to class (as class teacher)
// @route   PUT /api/teachers/:id/assign-class
// @access  Private/Admin
const assignTeacherToClass = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  body("classId").isMongoId().withMessage("Invalid class ID"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { classId } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    const classToAssign = await ClassModel.findById(classId);

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }
    if (!classToAssign) {
      return errorResponse(res, "Class not found", 404);
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add class to teacher's assignedClasses array if not already present
      if (!teacher.assignedClasses.includes(classId)) {
        teacher.assignedClasses.push(classId);
        await Teacher.findByIdAndUpdate(
          req.params.id,
          { assignedClasses: teacher.assignedClasses },
          { session }
        );
      }

      // Set the teacher as the class teacher
      await ClassModel.findByIdAndUpdate(
        classId,
        { classTeacher: req.params.id },
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_ASSIGNED_TO_CLASS",
        description: `Assigned teacher ${teacher.user.firstName} to class ${classToAssign.name} as class teacher`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return successResponse(
        res,
        null,
        "Teacher assigned to class successfully"
      );
    } catch (error) {
      // Abort the transaction
      await session.abortTransaction();
      session.endSession();
      console.error(error); // Log error
      return errorResponse(res, "Failed to assign teacher to class", 500);
    }
  }),
];

// @desc    Assign subject to teacher (for a specific class)
// @route   PUT /api/teachers/:id/assign-subject
// @access  Private/Admin
const assignSubjectToTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation
  body("subjectId").isMongoId().withMessage("Invalid subject ID"),
  body("classId").isMongoId().withMessage("Invalid class ID"), // Validate classId

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { subjectId, classId } = req.body; // classId is now required
    const teacher = await Teacher.findById(req.params.id);
    const subject = await Subject.findById(subjectId);
    const classToAssign = await ClassModel.findById(classId); // Fetch the class

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }
    if (!subject) {
      return errorResponse(res, "Subject not found", 404);
    }
    if (!classToAssign) {
      return errorResponse(res, "Class not found", 404); // Class not found
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add subject to teacher's assignedSubjects array if not already present
      if (!teacher.assignedSubjects.includes(subjectId)) {
        teacher.assignedSubjects.push(subjectId);
        await Teacher.updateOne(
          { _id: req.params.id },
          { $set: { assignedSubjects: teacher.assignedSubjects } },
          { session }
        );
      }
      // Add subject to class's subjects array
      if (!classToAssign.subjects.includes(subjectId)) {
        classToAssign.subjects.push(subjectId);
        await ClassModel.updateOne(
          { _id: classId },
          { $set: { subjects: classToAssign.subjects } },
          { session }
        );
      }

      // Add the teacher to the subject's assignedTeachers array, if not already present
      if (!subject.assignedTeachers.includes(req.params.id)) {
        subject.assignedTeachers.push(req.params.id);
        await Subject.updateOne(
          { _id: subjectId },
          { $set: { assignedTeachers: subject.assignedTeachers } },
          { session }
        );
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_ASSIGNED_SUBJECT",
        description: `Assigned teacher ${teacher.user.firstName} to subject ${subject.name} for class ${classToAssign.name}`, // Include class name
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(
        res,
        null,
        "Subject assigned to teacher successfully"
      );
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to assign subject to teacher", 500);
    }
  }),
];

// @desc    Unassign subject from teacher (for a specific class)
// @route   PUT /api/teachers/:id/unassign-subject
// @access  Private/Admin
const unassignSubjectFromTeacher = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),

  // Validation
  body("subjectId").isMongoId().withMessage("Invalid subject ID"),
  body("classId").isMongoId().withMessage("Invalid class ID"), // Validate classId

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { subjectId, classId } = req.body; // classId is now required
    const teacher = await Teacher.findById(req.params.id);
    const subject = await Subject.findById(subjectId);
    const classToUnassign = await ClassModel.findById(classId); // Fetch the class

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }
    if (!subject) {
      return errorResponse(res, "Subject not found", 404);
    }
    if (!classToUnassign) {
      return errorResponse(res, "Class not found", 404);
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove subject from teacher's assignedSubjects array if present
      if (teacher.assignedSubjects.includes(subjectId)) {
        const updatedAssignedSubjects = teacher.assignedSubjects.filter(
          (subId) => subId.toString() !== subjectId
        );
        await Teacher.findByIdAndUpdate(
          req.params.id,
          { assignedSubjects: updatedAssignedSubjects },
          { session }
        );
      }

      //Remove subject from class
      if (classToUnassign.subjects.includes(subjectId)) {
        const updateClassSubjects = classToUnassign.subjects.filter(
          (subId) => subId.toString() !== subjectId
        );
        await ClassModel.findByIdAndUpdate(
          classId,
          { subjects: updateClassSubjects },
          { session }
        );
      }

      // Remove the teacher from the subject's assignedTeachers array
      if (subject.assignedTeachers.includes(req.params.id)) {
        const updatedAssignedTeachers = subject.assignedTeachers.filter(
          (tId) => tId.toString() !== req.params.id
        );
        await Subject.findByIdAndUpdate(
          subjectId,
          { $set: { assignedTeachers: updatedAssignedTeachers } },
          { session }
        );
      }

      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_UNASSIGNED_SUBJECT",
        description: `Unassigned teacher ${teacher.user.firstName} from subject ${subject.name} for class ${classToUnassign.name}`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return successResponse(
        res,
        null,
        "Subject unassigned from teacher successfully"
      );
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error); // Log for debugging
      return errorResponse(res, "Failed to unassign subject from teacher", 500);
    }
  }),
];

// Function to generate a random password
const generateRandomPassword = () => {
  const length = 12;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};

export {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  updateTeacherStatus,
  getTeacherClasses,
  getTeacherSchedule,
  assignTeacherToClass,
  assignSubjectToTeacher,
  unassignSubjectFromTeacher,
};
