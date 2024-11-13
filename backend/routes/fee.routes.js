const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const { protect, authorize } = require('../middleware/auth');

// Stats route
router.get('/stats', protect, feeController.getFeeStats);

// Other fee routes
router.post('/collect', protect, feeController.collectFee);
router.get('/structure', protect, feeController.getFeeStructure);
router.get('/defaulters', protect, feeController.getDefaulters);
router.get('/reports', protect, feeController.getReports);

module.exports = router; 