const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const { protect, authorize } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Fee structure routes
router.get('/structure', feeController.getFeeStructure);

// Defaulters routes
router.get('/defaulters', authorize('admin'), feeController.getDefaulters);

// Reports routes
router.get('/reports', authorize('admin'), feeController.getReports);

// Fee collection routes
router.post('/collect', authorize('admin'), feeController.collectFee);

module.exports = router; 