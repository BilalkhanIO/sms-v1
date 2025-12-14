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
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "MULTI_SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.schoolId) {
      filter.school = req.schoolId;
    } else if (req.user.role === "MULTI_SCHOOL_ADMIN") {
      filter.school = { $in: req.user.managedSchools };
    }

    const teachers = await Teacher.find(filter)
      .populate("user", "firstName lastName email")
      .populate("assignedClasses", "name section")
      .populate("assignedSubjects", "name code"); // Populate assigned subjects

    return successResponse(res, teachers, "Teachers retrieved successfully");
  }),
];

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private (Admin, the teacher themselves)
const getTeacherById = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), // Allow teacher to see their own profile
  asyncHandler(async (req, res) => {
    const teacherId = req.params.id;
    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    // If a teacher is trying to access their own profile, ensure it's their ID
    if (req.user.role === "TEACHER" && req.user._id.toString() !== teacherId) {
      return errorResponse(res, "Not authorized to access this teacher's data", 403);
    }

    const teacher = await Teacher.findOne(filter)
      .populate("user", "firstName lastName email profilePicture")
      .populate("assignedClasses", "name section")
      .populate("assignedSubjects", "name code");

    if (!teacher) {
      return errorResponse(res, "Teacher not found", 404);
    }

    return successResponse(res, teacher, "Teacher retrieved successfully");
  }),
];

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private/Admin
const createTeacher = [
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

    const targetSchoolId = req.schoolId;

    // Verify the targetSchoolId exists if SUPER_ADMIN provides it
    if (req.user.role === "SUPER_ADMIN") {
      const schoolExists = await School.findById(targetSchoolId);
      if (!schoolExists) {
        return errorResponse(res, "Specified school not found", 404);
      }
    }
    
    // Check if teacher with the same employee ID already exists within the target school
    const teacherExists = await Teacher.findOne({ employeeId, school: targetSchoolId });
    if (teacherExists) {
      return errorResponse(
        res,
        "Teacher with this employee ID already exists in this school",
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
          folder: "teacher_profile_pictures",
          public_id: `${employeeId}_profile`,
        });
        profilePictureUrl = result.secure_url;
      }
      // Create a new user
      const user = await User.create(
        [
          {
            firstName,
            lastName,
            email,
            password: generateRandomPassword(),
            role: "TEACHER",
            status: "ACTIVE",
            profilePicture: profilePictureUrl,
            school: targetSchoolId, // Assign school to user
          },
        ],
        { session }
      );

      // Create the teacher
      const teacher = await Teacher.create(
        [
          {
            user: user[0]._id,
            employeeId,
            qualification,
            specialization,
            address,
            contactInfo,
            dateOfBirth,
            salary,
            documents,
            school: targetSchoolId, // Assign school to teacher
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
        description: `Created teacher ${firstName} ${lastName} (${employeeId}) in school ${targetSchoolId}`,
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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
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
  body('school').optional().isMongoId().withMessage("Invalid School ID provided"), // Validation for SUPER_ADMIN

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
      school: schoolIdFromReqBody, // Allow SUPER_ADMIN to potentially move teacher to another school
    } = req.body;

    const teacherId = req.params.id;
    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const teacher = await Teacher.findOne(filter).populate("user");

    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to access", 404);
    }

    let targetSchoolId = teacher.school; // Default to existing school

    if (req.user.role === "SUPER_ADMIN" && schoolIdFromReqBody) {
        // SUPER_ADMIN can change the school for a teacher
        const schoolExists = await School.findById(schoolIdFromReqBody);
        if (!schoolExists) {
            return errorResponse(res, "Specified school not found", 404);
        }
        targetSchoolId = schoolIdFromReqBody;
    } else if (req.user.role === "SCHOOL_ADMIN") {
        // SCHOOL_ADMIN can only update teachers within their own school
        if (teacher.school.toString() !== req.user.schoolId.toString()) {
            return errorResponse(res, "Not authorized to update teachers outside your school", 403);
        }
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
          school: targetSchoolId, // Update school on user also
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
        school: targetSchoolId, // Update school on teacher also
      };
      // Find and update the teacher
      const updatedTeacher = await Teacher.findOneAndUpdate(
        { _id: teacherId }, // Use teacherId without baseFilter here, as filter was applied on findOne
        updateData,
        { new: true, runValidators: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_UPDATED",
        description: `Updated teacher ${updatedTeacher.user.firstName} ${updatedTeacher.user.lastName} (${updatedTeacher.employeeId}) in school ${updatedTeacher.school}`,
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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
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
    const teacherId = req.params.id;
    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const teacher = await Teacher.findOne(filter).populate("user");

    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to delete", 404);
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
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

      // Delete the associated user, ensuring it's scoped by school for SCHOOL_ADMIN
      const userFilter = req.user.role === "SUPER_ADMIN" ? { _id: teacher.user._id } : { _id: teacher.user._id, school: req.user.schoolId };
      const userDeleteResult = await User.deleteOne(userFilter, { session });

      if (userDeleteResult.deletedCount === 0 && req.user.role !== "SUPER_ADMIN") {
        throw new Error("User not found or not authorized for deletion within school scope.");
      }

      // Delete the teacher
      const teacherDeleteResult = await Teacher.deleteOne({ _id: teacherId, ...baseFilter }, { session });
      if (teacherDeleteResult.deletedCount === 0 && req.user.role !== "SUPER_ADMIN") {
        throw new Error("Teacher not found or not authorized for deletion within school scope.");
      }
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_DELETED",
        description: `Deleted teacher ${teacher.user.firstName} ${teacher.user.lastName} (${teacher.employeeId}) from school ${teacher.school}`,
        context: "teacher-management",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, null, "Teacher and associated user removed");
    } catch (error) {
      // Abort the transaction
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error(error); // Log for debugging
      return errorResponse(res, "Failed to delete teacher", 500, error.message);
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

    const teacherId = req.params.id;
    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const { status } = req.body;
    const teacher = await Teacher.findOne(filter); // Use findOne with filter

    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to update status", 404);
    }

    teacher.status = status;
    const updatedTeacher = await teacher.save();
    // Log activity
    await Activity.logActivity({
      userId: req.user._id,
      type: "TEACHER_STATUS_UPDATED",
      description: `Updated teacher status to ${status} for ${teacher.employeeId} in school ${teacher.school}`,
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
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER"), // Authorize Teacher to view their own classes
  asyncHandler(async (req, res) => {
    const teacherId = req.params.id;
    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    // Find the teacher within the authorized school scope
    const teacher = await Teacher.findOne(filter);
    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to access", 404);
    }

    // Explicit check for teacher accessing their own data if not an admin
    if (req.user.role === "TEACHER" && req.user._id.toString() !== teacher.user.toString()) {
      return errorResponse(res, "Not authorized to access this teacher's classes", 403);
    }

    // Ensure classes are also filtered by school if not SUPER_ADMIN
    const classBaseFilter = req.user.role === "SUPER_ADMIN" ? {} : { school: req.user.schoolId };

    const classes = await ClassModel.find({
      ...classBaseFilter, // Apply school filter to classes
      $or: [
        { classTeacher: teacherId },
        { subjects: { $in: teacher.assignedSubjects } },
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
    const teacherId = req.params.id;

    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const teacher = await Teacher.findOne(filter); // Find teacher within school scope
    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to assign", 404);
    }

    // Filter for the class based on user's school context
    const classBaseFilter = req.user.role === "SUPER_ADMIN" ? {} : { school: req.user.schoolId };
    const classToAssign = await ClassModel.findOne({ _id: classId, ...classBaseFilter });

    if (!classToAssign) {
      return errorResponse(res, "Class not found or not authorized to assign", 404);
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add class to teacher's assignedClasses array if not already present
      if (!teacher.assignedClasses.includes(classId)) {
        teacher.assignedClasses.push(classId);
        await Teacher.findByIdAndUpdate(
          teacherId, // Use teacherId
          { assignedClasses: teacher.assignedClasses },
          { session }
        );
      }

      // Set the teacher as the class teacher
      await ClassModel.findByIdAndUpdate(
        classId,
        { classTeacher: teacherId }, // Use teacherId
        { session }
      );

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "TEACHER_ASSIGNED_TO_CLASS",
        description: `Assigned teacher ${teacher.user.firstName} to class ${classToAssign.name} as class teacher in school ${teacher.school}`,
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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error(error); // Log error
      return errorResponse(res, "Failed to assign teacher to class", 500, error.message);
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

    const { subjectId, classId } = req.body;
    const teacherId = req.params.id;

    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const teacher = await Teacher.findOne(filter); // Find teacher within school scope
    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to assign subject", 404);
    }

    // Filter for subject and class based on user's school context
    const schoolFilter = req.user.role === "SUPER_ADMIN" ? {} : { school: req.user.schoolId };

    const subject = await Subject.findOne({ _id: subjectId, ...schoolFilter });
    if (!subject) {
      return errorResponse(res, "Subject not found or not authorized to assign", 404);
    }

    const classToAssign = await ClassModel.findOne({ _id: classId, ...schoolFilter });
    if (!classToAssign) {
      return errorResponse(res, "Class not found or not authorized to assign", 404);
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add subject to teacher's assignedSubjects array if not already present
      if (!teacher.assignedSubjects.includes(subjectId)) {
        teacher.assignedSubjects.push(subjectId);
        await Teacher.updateOne(
          { _id: teacherId }, // Use teacherId
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
      if (!subject.assignedTeachers.includes(teacherId)) {
        subject.assignedTeachers.push(teacherId);
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
        description: `Assigned teacher ${teacher.user.firstName} to subject ${subject.name} for class ${classToAssign.name} in school ${teacher.school}`,
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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to assign subject to teacher", 500, error.message);
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

    const { subjectId, classId } = req.body;
    const teacherId = req.params.id;

    const filter = { _id: teacherId };
    if (req.schoolId) {
      filter.school = req.schoolId;
    }

    const teacher = await Teacher.findOne(filter); // Find teacher within school scope
    if (!teacher) {
      return errorResponse(res, "Teacher not found or not authorized to unassign subject", 404);
    }

    // Filter for subject and class based on user's school context
    const schoolFilter = req.user.role === "SUPER_ADMIN" ? {} : { school: req.user.schoolId };

    const subject = await Subject.findOne({ _id: subjectId, ...schoolFilter });
    if (!subject) {
      return errorResponse(res, "Subject not found or not authorized to unassign", 404);
    }

    const classToUnassign = await ClassModel.findOne({ _id: classId, ...schoolFilter });
    if (!classToUnassign) {
      return errorResponse(res, "Class not found or not authorized to unassign", 404);
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
          teacherId,
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
      if (subject.assignedTeachers.includes(teacherId)) {
        const updatedAssignedTeachers = subject.assignedTeachers.filter(
          (tId) => tId.toString() !== teacherId
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
        description: `Unassigned teacher ${teacher.user.firstName} from subject ${subject.name} for class ${classToUnassign.name} in school ${teacher.school}`,
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
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      console.error(error); // Log for debugging
      return errorResponse(res, "Failed to unassign subject from teacher", 500, error.message);
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
