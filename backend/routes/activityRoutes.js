// routes/activityRoutes.js
import express from "express";
import { getActivities } from "../controllers/activityController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { setSchoolId } from "../middleware/schoolMiddleware.js";

const router = express.Router();

// Only admins can view activities
router
  .route("/")
  .get(
    protect,
    authorize("SUPER_ADMIN", "SCHOOL_ADMIN"),
    setSchoolId,
    getActivities
  );

export default router;