import SuperAdminPage from "../models/SuperAdminPage.js";
import asyncHandler from "express-async-handler";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Get all super admin pages
// @route   GET /api/pages
// @access  Private/Super Admin
export const getPages = asyncHandler(async (req, res) => {
  const pages = await SuperAdminPage.find({});
  successResponse(res, pages, "Pages retrieved successfully");
});

// @desc    Create a super admin page
// @route   POST /api/pages
// @access  Private/Super Admin
export const createPage = asyncHandler(async (req, res) => {
  const { name, path, icon } = req.body;

  const page = new SuperAdminPage({
    name,
    path,
    icon,
  });

  const createdPage = await page.save();
  successResponse(res, createdPage, "Page created successfully");
});

// @desc    Update a super admin page
// @route   PUT /api/pages/:id
// @access  Private/Super Admin
export const updatePage = asyncHandler(async (req, res) => {
  const { name, path, icon } = req.body;

  const page = await SuperAdminPage.findById(req.params.id);

  if (page) {
    page.name = name;
    page.path = path;
    page.icon = icon;

    const updatedPage = await page.save();
    successResponse(res, updatedPage, "Page updated successfully");
  } else {
    errorResponse(res, "Page not found", 404);
  }
});

// @desc    Delete a super admin page
// @route   DELETE /api/pages/:id
// @access  Private/Super Admin
export const deletePage = asyncHandler(async (req, res) => {
  const page = await SuperAdminPage.findById(req.params.id);

  if (page) {
    await page.deleteOne();
    successResponse(res, null, "Page removed successfully");
  } else {
    errorResponse(res, "Page not found", 404);
  }
});
