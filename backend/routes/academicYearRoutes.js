// routes/academicYearRoutes.js
import express from 'express';
import {
  getAcademicYears,
  getAcademicYearById,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  setActiveYear,
  getActiveTerm,
} from '../controllers/academicYearController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { setSchoolId } from '../middleware/schoolMiddleware.js';

const router = express.Router();

// GET  /api/academic-years/active-term — must be registered before /:id to avoid clash
router
  .route('/active-term')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    setSchoolId,
    getActiveTerm
  );

// GET  /api/academic-years   — list (all authenticated roles)
// POST /api/academic-years   — create (admin only)
router
  .route('/')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    setSchoolId,
    getAcademicYears
  )
  .post(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    createAcademicYear
  );

// PATCH /api/academic-years/:id/set-active — must be before /:id to avoid ambiguity
router
  .route('/:id/set-active')
  .patch(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    setActiveYear
  );

// GET    /api/academic-years/:id
// PUT    /api/academic-years/:id
// DELETE /api/academic-years/:id
router
  .route('/:id')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    setSchoolId,
    getAcademicYearById
  )
  .put(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    updateAcademicYear
  )
  .delete(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    deleteAcademicYear
  );

export default router;
