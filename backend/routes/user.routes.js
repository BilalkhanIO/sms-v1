const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { hasPermission } = require('../middleware/checkPermission');

const router = express.Router();

// Validation middleware
const userValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('role').isIn(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT'])
    .withMessage('Invalid role'),
  body('status').isIn(['ACTIVE', 'INACTIVE', 'PENDING'])
    .withMessage('Invalid status')
];

// Routes
router.get('/', auth, hasPermission('MANAGE_USERS'), userController.getUsers);
router.post('/', auth, hasPermission('MANAGE_USERS'), userValidation, validateRequest, userController.createUser);
router.get('/:id', auth, hasPermission('MANAGE_USERS'), userController.getUserById);
router.put('/:id', auth, hasPermission('MANAGE_USERS'), userValidation, validateRequest, userController.updateUser);
router.delete('/:id', auth, hasPermission('MANAGE_USERS'), userController.deleteUser);

module.exports = router; 