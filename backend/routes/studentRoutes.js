import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateStudent } from '../middleware/validateStudent.js';
import {
  createStudent,
  getStudentProfile,
  updateStudentProfile,
  getAcademicPerformance,
  generateStudentReport,
} from '../controllers/studentController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Public routes (accessible by all authenticated users)
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.get('/:id/attendance-report', getAttendanceReport);
router.get('/:id/fee-status', getFeeStatus);

// Routes restricted to admin and teachers
router.use(authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']));

router.post('/', validateStudent, createStudent);
router.put('/:id', validateStudent, updateStudent);
router.delete('/:id', authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), deleteStudent);

// Academic records management
router.post('/:id/academic-records', addAcademicRecord);

// Attendance management
router.post('/:id/attendance', markAttendance);

// Fee management (restricted to admin only)
router.post(
  '/:id/fee-records', 
  authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), 
  addFeeRecord
);

router.get('/profile', getStudentProfile);
router.put('/profile', validateStudent, updateStudentProfile);

router.get('/:id/performance', authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']), getAcademicPerformance);
router.get('/:id/report', authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER']), generateStudentReport);

export default router; 