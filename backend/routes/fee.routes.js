const express = require('express');
const router = express.Router();
const feeController = require('../controllers/fee.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, feeController.getFeeStats);

module.exports = router; 