import asyncHandler from "express-async-handler";
import Parent from "../models/Parent.js";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getParents = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === "SCHOOL_ADMIN") {
    filter.school = req.user.schoolId;
  }
  const parents = await Parent.find(filter)
    .populate("user", "firstName lastName email profilePicture status")
    .populate("children", "admissionNumber");
  successResponse(res, parents);
});

export const getParentById = asyncHandler(async (req, res) => {
  const parent = await Parent.findById(req.params.id)
    .populate("user", "firstName lastName email profilePicture status")
    .populate({
      path: "children",
      populate: { path: "class", select: "name section" },
    });
  if (!parent) return errorResponse(res, "Parent not found", 404);
  successResponse(res, parent);
});

export const createParent = asyncHandler(async (req, res) => {
  const { userId, contactNumber, address, children } = req.body;
  const existing = await Parent.findOne({ user: userId });
  if (existing) return errorResponse(res, "Parent profile already exists for this user", 400);
  const parent = await Parent.create({ user: userId, contactNumber, address, children: children || [] });
  await parent.populate("user", "firstName lastName email");
  successResponse(res, parent, 201);
});

export const updateParent = asyncHandler(async (req, res) => {
  const { contactNumber, address, children } = req.body;
  const parent = await Parent.findByIdAndUpdate(
    req.params.id,
    { contactNumber, address, children },
    { new: true, runValidators: true }
  ).populate("user", "firstName lastName email");
  if (!parent) return errorResponse(res, "Parent not found", 404);
  successResponse(res, parent);
});

export const deleteParent = asyncHandler(async (req, res) => {
  const parent = await Parent.findByIdAndDelete(req.params.id);
  if (!parent) return errorResponse(res, "Parent not found", 404);
  successResponse(res, { message: "Parent deleted successfully" });
});
