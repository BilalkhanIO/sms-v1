const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// Protect all dashboard routes
router.use(protect);

// Get dashboard stats based on role
router.get('/stats/:role', dashboardController.getStats);

// Get recent activities
router.get('/activities', dashboardController.getRecentActivities);

// Get upcoming classes
router.get('/upcoming-classes', dashboardController.getUpcomingClasses);

// Get attendance data
router.get('/attendance', dashboardController.getAttendanceData);

// Get performance data
router.get('/performance', dashboardController.getPerformanceData);

// Get fee collection stats
router.get('/fee-stats', authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']), dashboardController.getFeeStats);

module.exports = router; 