// routes/routeDefaults.js  (Generally good, but direct usage often clearer)
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

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