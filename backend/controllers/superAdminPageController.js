import SuperAdminPage from "../models/SuperAdminPage.js";
import asyncHandler from "express-async-handler";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// @desc    Create a new Super Admin Page
// @route   POST /api/super-admin-pages
// @access  Private/SuperAdmin
export const createSuperAdminPage = asyncHandler(async (req, res) => {
  const { name, path, icon, component } = req.body;

  const pageExists = await SuperAdminPage.findOne({ path });

  if (pageExists) {
    return errorResponse(res, "Page with this path already exists", 400);
  }

  const page = await SuperAdminPage.create({
    name,
    path,
    icon,
    component,
  });

  if (page) {
    successResponse(res, page, "Page created successfully", 201);
  } else {
    errorResponse(res, "Invalid page data", 400);
  }
});

// @desc    Get all Super Admin Pages
// @route   GET /api/super-admin-pages
// @access  Private/SuperAdmin
export const getSuperAdminPages = asyncHandler(async (req, res) => {
  const pages = await SuperAdminPage.find({});
  successResponse(res, pages, "Pages retrieved successfully");
});

// @desc    Get Super Admin Page by ID
// @route   GET /api/super-admin-pages/:id
// @access  Private/SuperAdmin
export const getSuperAdminPageById = asyncHandler(async (req, res) => {
  const page = await SuperAdminPage.findById(req.params.id);

  if (page) {
    successResponse(res, page, "Page retrieved successfully");
  } else {
    errorResponse(res, "Page not found", 404);
  }
});

// @desc    Update a Super Admin Page
// @route   PUT /api/super-admin-pages/:id
// @access  Private/SuperAdmin
export const updateSuperAdminPage = asyncHandler(async (req, res) => {
  const { name, path, icon, component } = req.body;

  const page = await SuperAdminPage.findById(req.params.id);

  if (page) {
    page.name = name || page.name;
    page.path = path || page.path;
    page.icon = icon || page.icon;
    page.component = component || page.component;

    const updatedPage = await page.save();
    successResponse(res, updatedPage, "Page updated successfully");
  } else {
    errorResponse(res, "Page not found", 404);
  }
});

// @desc    Delete a Super Admin Page
// @route   DELETE /api/super-admin-pages/:id
// @access  Private/SuperAdmin
export const deleteSuperAdminPage = asyncHandler(async (req, res) => {
  const page = await SuperAdminPage.findById(req.params.id);

  if (page) {
    await page.deleteOne();
    successResponse(res, {}, "Page removed successfully");
  } else {
    errorResponse(res, "Page not found", 404);
  }
});
