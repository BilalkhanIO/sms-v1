import asyncHandler from "express-async-handler";
import School from "../models/School.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get schools managed by the multi-school admin
// @route   GET /api/multi-school-admin/schools
// @access  Private/MULTI_SCHOOL_ADMIN
const getManagedSchools = asyncHandler(async (req, res) => {
  const managedSchools = await School.find({
    _id: { $in: req.user.managedSchools },
  }).populate("admin", "firstName lastName email");

  return successResponse(res, managedSchools, "Managed schools fetched successfully");
});

// @desc    Get all school admins for the managed schools
// @route   GET /api/multi-school-admin/admins
// @access  Private/MULTI_SCHOOL_ADMIN
const getSchoolAdmins = asyncHandler(async (req, res) => {
    const schoolAdmins = await User.find({
        role: "SCHOOL_ADMIN",
        school: { $in: req.user.managedSchools },
    }).populate("school", "name").select("firstName lastName email school");

    return successResponse(res, schoolAdmins, "School admins fetched successfully");
});

// @desc    Assign a school admin to a school
// @route   POST /api/multi-school-admin/assign-admin
// @access  Private/MULTI_SCHOOL_ADMIN
const assignSchoolAdmin = asyncHandler(async (req, res) => {
    const { schoolId, adminId } = req.body;

    if (!req.user.managedSchools.includes(schoolId)) {
        return errorResponse(res, "You are not authorized to manage this school", 403);
    }

    const school = await School.findById(schoolId);
    if (!school) {
        return errorResponse(res, "School not found", 404);
    }

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "SCHOOL_ADMIN") {
        return errorResponse(res, "Admin not found or user is not a school admin", 404);
    }

    school.admin = adminId;
    await school.save();

    admin.school = schoolId;
    await admin.save();

    return successResponse(res, null, "Admin assigned to school successfully");
});

// @desc    Unassign a school admin from a school
// @route   POST /api/multi-school-admin/unassign-admin
// @access  Private/MULTI_SCHOOL_ADMIN
const unassignSchoolAdmin = asyncHandler(async (req, res) => {
    const { schoolId } = req.body;

    if (!req.user.managedSchools.includes(schoolId)) {
        return errorResponse(res, "You are not authorized to manage this school", 403);
    }

    const school = await School.findById(schoolId);
    if (!school) {
        return errorResponse(res, "School not found", 404);
    }

    if (school.admin) {
        const admin = await User.findById(school.admin);
        if (admin) {
            admin.school = null;
            await admin.save();
        }
    }

    school.admin = null;
    await school.save();

    return successResponse(res, null, "Admin unassigned from school successfully");
});

export { getManagedSchools, getSchoolAdmins, assignSchoolAdmin, unassignSchoolAdmin };
