// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard - Get dashboard statistics (All roles)
router.route("/").get(protect, getDashboardStats); // Removed redundant authorize

export default router;
