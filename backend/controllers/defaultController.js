import SuperAdminPage from "../models/SuperAdminPage.js";
import asyncHandler from "express-async-handler";
import { successResponse } from "../utils/apiResponse.js";

export const getSuperAdminPages = asyncHandler(async (req, res) => {
  const pages = await SuperAdminPage.find();
  successResponse(res, pages, "Super admin pages retrieved successfully");
});
