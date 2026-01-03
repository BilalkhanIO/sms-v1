import express from "express";
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/pagesController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("SUPER_ADMIN"), getPages)
  .post(protect, authorize("SUPER_ADMIN"), createPage);

router
  .route("/:id")
  .put(protect, authorize("SUPER_ADMIN"), updatePage)
  .delete(protect, authorize("SUPER_ADMIN"), deletePage);

export default router;
