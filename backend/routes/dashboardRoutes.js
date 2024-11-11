const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // Protect all dashboard routes

// Stats routes
router.get('/stats/:role', dashboardController.getStats);
router.get('/activities', dashboardController.getRecentActivities);
router.get('/upcoming-classes', dashboardController.getUpcomingClasses);
router.get('/attendance', dashboardController.getAttendanceData);

module.exports = router; 