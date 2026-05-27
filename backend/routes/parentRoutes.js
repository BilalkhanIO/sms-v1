import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
} from "../controllers/parentController.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), getParents);
router.post("/", authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), createParent);
router.get("/:id", authorize("SUPER_ADMIN", "SCHOOL_ADMIN", "PARENT"), getParentById);
router.put("/:id", authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), updateParent);
router.delete("/:id", authorize("SUPER_ADMIN"), deleteParent);

export default router;
