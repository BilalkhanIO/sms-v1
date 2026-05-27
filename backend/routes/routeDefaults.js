// routes/routeDefaults.js
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getSuperAdminPages, getAvailableSuperAdminPages } from "../controllers/defaultController.js";

// Standard route creation with role-based protection (Less frequently used now)
export const createProtectedRoute = (roles = []) => {
  const router = express.Router();
  if (roles.length) {
    router.use(protect, authorize(...roles));
  } else {
    router.use(protect);
  }
  return router;
};

// Standard admin roles for easy reference
export const ADMIN_ROLES = ["SUPER_ADMIN", "SCHOOL_ADMIN"];

const router = express.Router();

router.get(
  "/super-admin-pages",
  protect,
  authorize("SUPER_ADMIN"),
  getSuperAdminPages
);

router.get(
    "/available-super-admin-pages",
    protect,
    authorize("SUPER_ADMIN"),
    getAvailableSuperAdminPages
);

export default router;
