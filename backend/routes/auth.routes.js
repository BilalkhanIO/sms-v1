const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { validateRegistration, validateLogin } = require('../middleware/validateAuth');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes'
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: 'Too many password reset attempts, please try again after an hour'
});

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-password', authController.updatePassword);

module.exports = router;