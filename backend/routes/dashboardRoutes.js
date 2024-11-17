const express = require('express');
const router = express.Router();
const {
  getStats,
  getRecentActivities,
  getUpcomingClasses
} = require('../controllers/dashboardController');

// Only include routes that have corresponding controller functions
router.get('/stats/:role', getStats);
router.get('/activities', getRecentActivities);
router.get('/upcoming-classes', getUpcomingClasses);

module.exports = router; 