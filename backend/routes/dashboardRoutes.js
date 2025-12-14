import express from "express";
import { getDashboardStats, getSuperAdminStats, getSchoolStats, getUserRoleDistribution, getUserStatusDistribution, getSchoolStatusDistribution, getUserRegistrationTrends, getSchoolDetails } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/super-admin-stats", protect, authorize("SUPER_ADMIN"), getSuperAdminStats);
router.get(
  "/school-details/:schoolId",
  protect,
  authorize("SUPER_ADMIN", "MULTI_SCHOOL_ADMIN"),
  setSchoolId,
  getSchoolDetails
);
router.get("/school-stats", protect, getSchoolStats);
router.get("/user-role-distribution", protect, authorize("SUPER_ADMIN"), getUserRoleDistribution);
router.get("/user-status-distribution", protect, authorize("SUPER_ADMIN"), getUserStatusDistribution);
router.get("/school-status-distribution", protect, authorize("SUPER_ADMIN"), getSchoolStatusDistribution);
router.get("/user-registration-trends", protect, authorize("SUPER_ADMIN"), getUserRegistrationTrends);

export default router;
