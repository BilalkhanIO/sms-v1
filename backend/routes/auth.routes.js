const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../middleware/validateAuth');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-password', authController.updatePassword);

module.exports = router; 