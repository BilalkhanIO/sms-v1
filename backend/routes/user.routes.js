// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

// User management routes
// Protect all routes after this middleware

// Routes accessible by all authenticated users
router.get('/me', userController.getUserById);
router.put('/update-password', userController.updatePassword);
router.get('/active-devices', userController.getActiveDevices);
router.delete('/devices/:deviceId', userController.removeDevice);

// 2FA routes
router.post('/enable-2fa', userController.enableTwoFactor);
router.post('/disable-2fa', userController.disableTwoFactor);

// Admin only routes
 // Restrict access to admins only
router.get('/', userController.getUsers);
router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
