import express from "express";
import { getDashboardStats, getSchoolStats, getUserRoleDistribution, getUserStatusDistribution, getSchoolStatusDistribution, getUserRegistrationTrends } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/school-stats", protect, getSchoolStats);
router.get("/user-role-distribution", protect, authorize("SUPER_ADMIN"), getUserRoleDistribution);
router.get("/user-status-distribution", protect, authorize("SUPER_ADMIN"), getUserStatusDistribution);
router.get("/school-status-distribution", protect, authorize("SUPER_ADMIN"), getSchoolStatusDistribution);
router.get("/user-registration-trends", protect, authorize("SUPER_ADMIN"), getUserRegistrationTrends);

export default router;
