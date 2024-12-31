const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStats,
  getRecentActivities,
  getUpcomingClasses,
  getPerformanceStats
} = require('../controllers/dashboardController');

// Protect all dashboard routes
router.use(protect);

router.get('/stats/:role', getStats);
router.get('/activities', getRecentActivities);
router.get('/upcoming-classes', getUpcomingClasses);
router.get('/performance', protect, getPerformanceStats);

module.exports = router;