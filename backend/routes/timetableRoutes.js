// routes/timetableRoutes.js
import express from 'express';
import {
  getTimetableByClass,
  getTimetableByTeacher,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getMyTimetable,
  getTimetableById,
} from '../controllers/timetableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { setSchoolId } from '../middleware/schoolMiddleware.js';

const router = express.Router();

// GET /api/timetables/my
// Must be registered before /:id to avoid "my" being treated as a Mongo ID
router
  .route('/my')
  .get(
    protect,
    authorize('TEACHER', 'STUDENT'),
    setSchoolId,
    getMyTimetable
  );

// GET /api/timetables/class/:classId
router
  .route('/class/:classId')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'),
    setSchoolId,
    getTimetableByClass
  );

// GET /api/timetables/teacher/:teacherId
router
  .route('/teacher/:teacherId')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'),
    setSchoolId,
    getTimetableByTeacher
  );

// GET  /api/timetables       — reserved for future list endpoint
// POST /api/timetables       — create timetable (admin only)
router
  .route('/')
  .post(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    createTimetable
  );

// GET    /api/timetables/:id
// PUT    /api/timetables/:id
// DELETE /api/timetables/:id
router
  .route('/:id')
  .get(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT'),
    setSchoolId,
    getTimetableById
  )
  .put(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    updateTimetable
  )
  .delete(
    protect,
    authorize('SUPER_ADMIN', 'SCHOOL_ADMIN'),
    setSchoolId,
    deleteTimetable
  );

export default router;
