import express from "express";
import {
  createSuperAdminPage,
  getSuperAdminPages,
  getSuperAdminPageById,
  updateSuperAdminPage,
  deleteSuperAdminPage,
} from "../controllers/superAdminPageController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("SUPER_ADMIN"), createSuperAdminPage)
  .get(protect, authorize("SUPER_ADMIN"), getSuperAdminPages);

router
  .route("/:id")
  .get(protect, authorize("SUPER_ADMIN"), getSuperAdminPageById)
  .put(protect, authorize("SUPER_ADMIN"), updateSuperAdminPage)
  .delete(protect, authorize("SUPER_ADMIN"), deleteSuperAdminPage);

export default router;
