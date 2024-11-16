// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin, validateRegistration } = require('../middleware/validateAuth');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);

module.exports = router;
