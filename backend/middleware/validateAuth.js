const { check, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validateRegistration = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please include a valid email')
    .isLength({ max: 255 })
    .withMessage('Email address too long'),
  
  check('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    next();
  }
];

exports.validateLogin = [
  check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please include a valid email'),
  
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    next();
  }
];