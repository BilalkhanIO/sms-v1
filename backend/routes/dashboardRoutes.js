const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStats,
  getRecentActivities,
  getUpcomingClasses
} = require('../controllers/dashboardController');

router.use(protect);

router.get('/stats/:role', getStats);
router.get('/activities', getRecentActivities);
router.get('/upcoming-classes', getUpcomingClasses);

module.exports = router; 