import SuperAdminPage from "../models/SuperAdminPage.js";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/apiResponse.js";

export const getSuperAdminPages = asyncHandler(async (req, res) => {
  const pages = await SuperAdminPage.find();
  successResponse(res, pages, "Super admin pages retrieved successfully");
});

export const getAvailableSuperAdminPages = asyncHandler(async (req, res) => {
    const pages = await SuperAdminPage.find();
    const pageData = pages.map(page => ({
        name: page.name,
        component: page.component,
        path: page.path,
    }));
    successResponse(res, pageData, "Available super admin pages retrieved successfully");
});
