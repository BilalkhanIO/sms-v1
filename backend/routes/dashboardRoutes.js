// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(protect, admin, getDashboardStats);

export default router;
