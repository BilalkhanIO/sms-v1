import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
    getManagedSchools,
    getSchoolAdmins,
    assignSchoolAdmin,
    unassignSchoolAdmin
} from "../controllers/multiSchoolAdminController.js";

const router = express.Router();

router.use(protect);
router.use(authorize("MULTI_SCHOOL_ADMIN"));

router.route("/schools").get(getManagedSchools);
router.route("/admins").get(getSchoolAdmins);
router.route("/assign-admin").post(assignSchoolAdmin);
router.route("/unassign-admin").post(unassignSchoolAdmin);

export default router;
