const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const { protect, authorize } = require('../middleware/auth');

// Stats route
router.get('/stats', protect, feeController.getFeeStats);

// Fee collection routes
router.post('/collect', protect, feeController.collectFee);
router.get('/structure', protect, feeController.getFeeStructure);
router.get('/defaulters', protect, feeController.getDefaulters);
router.get('/reports', protect, feeController.getReports);

// Fee type routes
router.get('/types', protect, feeController.getFeeTypes);
router.post('/types', protect, authorize(['ADMIN']), feeController.createFeeType);

// Fee structure routes
router.get('/structure/:classId', protect, feeController.getFeeStructureByClass);
router.put('/structure/:classId', protect, authorize(['ADMIN']), feeController.updateFeeStructure);

module.exports = router; 