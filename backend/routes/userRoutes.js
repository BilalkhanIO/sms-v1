const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protected routes
router.use(protect);

// Profile routes (available to all authenticated users)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post(
  '/profile/picture',
  upload.single('profilePicture'),
  userController.uploadProfilePicture
);

// Admin only routes
router.use(authorize(['SUPER_ADMIN', 'SCHOOL_ADMIN']));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router; 