// controllers/userController.js
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";
import asyncHandler from "express-async-handler";
import Activity from "../models/Activity.js";
import { body, validationResult } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import cloudinary from "../utils/cloudinary.js"; // Import Cloudinary
import upload from "../utils/multer.js"; // Import Multer
import mongoose from "mongoose";

// Helper function to create specific user type data
const createUserTypeData = async (role, userId, userData, session) => {
  // Add session parameter
  switch (role) {
    case "TEACHER":
      await Teacher.create([{ user: userId, ...userData }], { session }); // Pass session
      break;
    case "STUDENT":
      await Student.create([{ user: userId, ...userData }], { session }); // Pass session
      break;
    case "PARENT":
      await Parent.create([{ user: userId, ...userData }], { session }); // Pass session
      break;
    default:
      break;
  }
};

// Helper function to update specific user type data
const updateUserTypeData = async (role, userId, userData, session) => {
  // Add session parameter
  switch (role) {
    case "TEACHER":
      await Teacher.findOneAndUpdate({ user: userId }, userData, {
        new: true,
        upsert: true, // Create if not exists, update if exists
        session, // Pass session
      });
      break;
    case "STUDENT":
      await Student.findOneAndUpdate({ user: userId }, userData, {
        new: true,
        upsert: true,
        session,
      });
      break;
    case "PARENT":
      await Parent.findOneAndUpdate({ user: userId }, userData, {
        new: true,
        upsert: true,
        session,
      });
      break;
    default:
      break;
  }
};

// @desc       Get all users (Admin only)
// @route      GET /api/users
// @access     Private/Admin
const getUsers = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const { role, status, search } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password") // Exclude password from results
      .sort("-createdAt"); // Sort by creation date (descending)
    return successResponse(res, users, "Users retrieved successfully");
  }),
];

// @desc        Get user profile (Self)
// @route       GET /api/users/profile
// @access      Private
const getProfile = [
  protect, // Ensure user is authenticated
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, user, "User profile retrieved successfully");
  }),
];

// @desc        Update user profile (Self)
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = [
  protect, // Ensure user is authenticated
  upload.single("profilePicture"), // Handle profile picture uploads

  // Validation (allow optional updates)
  body("firstName").optional().notEmpty().withMessage("First name is required"),
  body("lastName").optional().notEmpty().withMessage("Last name is required"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Handle profile picture upload
    let profilePictureUrl = user.profilePicture; // Keep existing picture if not updated
    if (req.file) {
      // If there's an existing picture and a new one is uploaded, delete the old one
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting old profile picture:", error);
          //  Don't necessarily fail the entire request if deleting old picture fails,
          // but it's a good idea to log for investigation
        }
      }

      // Upload new profile picture
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "user_profile_pictures", // You might want a general folder for all user pictures
        public_id: `${user._id}_profile`, // Unique ID for the picture
      });
      profilePictureUrl = result.secure_url;
    }

    // Update user information (firstName, lastName, profilePicture, password)
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.profilePicture = profilePictureUrl;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook in User model will handle hashing
    }

    const updatedUser = await user.save();

    // Log activity
    await Activity.logActivity({
      userId: updatedUser._id,
      type: "PROFILE_UPDATED",
      description: "Updated profile information",
      context: "user-profile", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(
      res,
      {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
      },
      "Profile updated successfully"
    );
  }),
];

// @desc        Update user role (Admin only)
// @route       PUT /api/users/:id/role
// @access      Private/Admin
const updateUserRole = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  // Validate role
  body("role")
    .isIn(["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"])
    .withMessage("Invalid role"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.role = role;
    const updatedUser = await user.save();

    // Log activity
    await Activity.logActivity({
      userId: req.user._id, // Admin performing the update
      type: "USER_ROLE_UPDATED", // Specific activity type
      description: `Updated user role to ${role} for user ID ${req.params.id}`,
      context: "user-management", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(res, updatedUser, "User role updated successfully");
  }),
];

// @Desc      User Creation (Admin Only)
// @Route     POST /api/users
// @Access    Admin
const createUser = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  upload.single("profilePicture"), // Handle profile picture uploads

  // Validation rules
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("role")
    .isIn(["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn([
      "ACTIVE",
      "INACTIVE",
      "PENDING_EMAIL_VERIFICATION",
      "PENDING_ADMIN_APPROVAL",
      "SUSPENDED",
      "DELETED",
    ])
    .withMessage("Invalid status"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const { firstName, lastName, email, password, role, status, ...rest } =
      req.body; // 'rest' contains role-specific data

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, "User already exists with this email", 400);
    }

    // Handle profile picture upload
    let profilePictureUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "user_profile_pictures", // You might want a general folder for all user pictures
        public_id: `${Date.now()}_profile`, // Unique ID for picture
      });
      profilePictureUrl = result.secure_url;
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the user
      const user = await User.create(
        [
          {
            firstName,
            lastName,
            email,
            password,
            role: role || "STUDENT", // Default role if not provided
            status: status || "PENDING_ADMIN_APPROVAL", // Default status
            profilePicture: profilePictureUrl,
          },
        ],
        { session }
      ); // Pass session to create

      // Create role-specific data
      await createUserTypeData(role, user[0]._id, rest, session); // Pass session

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id,
        type: "USER_CREATED",
        description: `Created user ${firstName} ${lastName} with role ${role}`,
        context: "user-management", // Added context
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return successResponse(
        res,
        {
          _id: user[0]._id,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          email: user[0].email,
          role: user[0].role,
          status: user[0].status,
        },
        "User created successfully",
        201
      );
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to create user", 500, error.message);
    }
  }),
];

// @desc    Update User (Admin Only - handles both User and type-specific data)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  upload.single("profilePicture"), // Handle profile picture updates

  // Validation (allow optional updates, and specific validations per field)
  body("firstName").optional().notEmpty().withMessage("First name is required"),
  body("lastName").optional().notEmpty().withMessage("Last name is required"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("role")
    .optional()
    .isIn(["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "STUDENT", "PARENT"])
    .withMessage("Invalid role"),
  body("status")
    .optional()
    .isIn([
      "ACTIVE",
      "INACTIVE",
      "PENDING_EMAIL_VERIFICATION",
      "PENDING_ADMIN_APPROVAL",
      "SUSPENDED",
      "DELETED",
    ])
    .withMessage("Invalid status"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }

    const userId = req.params.id;
    const { firstName, lastName, email, role, status, ...rest } = req.body; // Destructure rest for role-specific data

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Handle profile picture update
    let profilePictureUrl = user.profilePicture; // Keep existing URL by default

    if (req.file) {
      // If there's an existing picture, delete it from Cloudinary first
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload the new profile picture
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "user_profile_pictures",
        public_id: `${userId}_profile`, // Use user ID for public ID
      });
      profilePictureUrl = result.secure_url;
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update User data
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email: email || user.email,
          role: role || user.role, // Allow updating the role
          status: status || user.status, // Allow updating the status
          profilePicture: profilePictureUrl,
        },
        { new: true, runValidators: true, session } // Pass session
      );
      // Update role-specific data
      await updateUserTypeData(role || user.role, userId, rest, session); // Pass session and updated/existing role

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id, // Admin performing update
        type: "USER_UPDATED",
        description: `Updated user ${updatedUser.firstName} ${updatedUser.lastName} (ID: ${updatedUser._id})`,
        context: "user-management", // Added context
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(
        res,
        {
          _id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          status: updatedUser.status,
          profilePicture: updatedUser.profilePicture,
        },
        "User updated successfully"
      );
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to update user", 500, error.message);
    }
  }),
];

// @desc      Delete a user (admin only)
// @route     DELETE /api/users/:id
// @access    Private/Admin
const deleteUser = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Start a session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // If there's a profile picture, delete it from Cloudinary first
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete related data based on role
      switch (user.role) {
        case "TEACHER":
          await Teacher.deleteOne({ user: id }, { session }); // Pass session
          break;
        case "STUDENT":
          await Student.deleteOne({ user: id }, { session }); // Pass session
          break;
        case "PARENT":
          await Parent.deleteOne({ user: id }, { session }); // Pass session
          break;
        default:
          break;
      }

      // Delete the user
      await User.deleteOne({ _id: id }, { session }); // Pass session

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Log activity
      await Activity.logActivity({
        userId: req.user._id, // Admin user
        type: "USER_DELETED",
        description: `Deleted user ${user.firstName} ${user.lastName} (ID: ${id})`, // Include name and ID
        context: "user-management", // Added context
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
      return successResponse(res, null, "User removed successfully");
    } catch (error) {
      // Abort transaction
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      return errorResponse(res, "Failed to delete user", 500);
    }
  }),
];

// @desc       Get user by ID (Admin or self)
// @route      GET /api/users/:id
// @access     Private (Admin or self)
const getUserById = [
  protect, // Ensure user is authenticated
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Authorization check: Admin or the user themselves
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "SCHOOL_ADMIN" &&
      req.user._id.toString() !== userId
    ) {
      return errorResponse(
        res,
        "Not authorized to access this user's data",
        403
      );
    }

    let userData = { ...user.toObject() }; // Convert to plain object

    // Fetch and include role-specific data
    switch (user.role) {
      case "TEACHER":
        const teacherData = await Teacher.findOne({ user: userId });
        userData = { ...userData, teacherDetails: teacherData };
        break;
      case "STUDENT":
        const studentData = await Student.findOne({ user: userId });
        userData = { ...userData, studentDetails: studentData };
        break;
      case "PARENT":
        const parentData = await Parent.findOne({ user: userId });
        userData = { ...userData, parentDetails: parentData };
        break;
      default:
        break;
    }
    return successResponse(res, userData, "User data retrieved successfully");
  }),
];

// @desc        Update user status (Admin only)
// @route       PUT /api/users/:id/status
// @access      Private/Admin
const updateUserStatus = [
  protect,
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
  // Validate status
  body("status")
    .isIn([
      "ACTIVE",
      "INACTIVE",
      "PENDING_EMAIL_VERIFICATION",
      "PENDING_ADMIN_APPROVAL",
      "SUSPENDED",
      "DELETED",
    ])
    .withMessage("Invalid status"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation failed", 400, errors.array());
    }
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.status = status;
    const updatedUser = await user.save();

    // Log activity
    await Activity.logActivity({
      userId: req.user._id, // Admin performing the update
      type: "USER_STATUS_UPDATED", // Specific activity type
      description: `Updated user status to ${status} for user ID ${req.params.id}`,
      context: "user-management", // Added context
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    return successResponse(
      res,
      updatedUser,
      "User status updated successfully"
    );
  }),
];

export {
  getUsers,
  getProfile,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
};
