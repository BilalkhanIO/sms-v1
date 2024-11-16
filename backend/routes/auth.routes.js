// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.put('/update-password', authController.updatePassword);

module.exports = router;
