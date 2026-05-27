import asyncHandler from "express-async-handler";
import Parent from "../models/Parent.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const schoolScopedUserIds = async (schoolId) => {
  const users = await User.find({ school: schoolId }, "_id").lean();
  return users.map((u) => u._id);
};

export const getParents = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "SCHOOL_ADMIN") {
    const userIds = await schoolScopedUserIds(req.user.schoolId);
    filter.user = { $in: userIds };
  }
  const parents = await Parent.find(filter)
    .populate("user", "firstName lastName email profilePicture status")
    .populate("children", "admissionNumber");
  successResponse(res, parents);
});

export const getParentById = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id)
    .populate("user", "firstName lastName email profilePicture status school")
    .populate({
      path: "children",
      populate: { path: "class", select: "name section" },
    });
  if (!parent) return errorResponse(res, "Parent not found", 404);
  if (
    req.user.role === "SCHOOL_ADMIN" &&
    String(parent.user?.school) !== String(req.user.schoolId)
  ) {
    return errorResponse(res, "Access denied", 403);
  }
  successResponse(res, parent);
});

export const createParent = asyncHandler(async (req, res) => {
  const { userId, contactNumber, address, children } = req.body;
  if (req.user.role === "SCHOOL_ADMIN") {
    const user = await User.findById(userId, "school").lean();
    if (!user || String(user.school) !== String(req.user.schoolId)) {
      return errorResponse(res, "User does not belong to your school", 403);
    }
  }
  const existing = await Parent.findOne({ user: userId });
  if (existing) return errorResponse(res, "Parent profile already exists for this user", 400);
  const parent = await Parent.create({ user: userId, contactNumber, address, children: children || [] });
  await parent.populate("user", "firstName lastName email");
  successResponse(res, parent, 201);
});

export const updateParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id).populate("user", "school");
  if (!parent) return errorResponse(res, "Parent not found", 404);
  if (
    req.user.role === "SCHOOL_ADMIN" &&
    String(parent.user?.school) !== String(req.user.schoolId)
  ) {
    return errorResponse(res, "Access denied", 403);
  }
  const { contactNumber, address, children } = req.body;
  const update = {};
  if (contactNumber !== undefined) update.contactNumber = contactNumber;
  if (address !== undefined) update.address = address;
  if (children !== undefined) update.children = children;

  const updated = await Parent.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate("user", "firstName lastName email");
  successResponse(res, updated);
});

export const deleteParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id).populate("user", "school");
  if (!parent) return errorResponse(res, "Parent not found", 404);
  if (
    req.user.role === "SCHOOL_ADMIN" &&
    String(parent.user?.school) !== String(req.user.schoolId)
  ) {
    return errorResponse(res, "Access denied", 403);
  }
  await Parent.findByIdAndDelete(req.params.id);
  successResponse(res, { message: "Parent deleted successfully" });
});
