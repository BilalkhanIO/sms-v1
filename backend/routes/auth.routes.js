const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../middleware/validateAuth');
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  getMe,
  updatePassword 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.put('/update-password', updatePassword);

module.exports = router; 