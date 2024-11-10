import { body, validationResult } from 'express-validator';

export const validateStudentCreation = [
  // Basic Information
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('rollNumber')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required')
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage('Roll number can only contain letters, numbers and hyphens'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Valid date of birth is required')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      if (age < 3 || age > 25) {
        throw new Error('Student age must be between 3 and 25 years');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood group'),

  // Contact Information
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),
  
  // Academic Information
  body('currentClass')
    .isMongoId()
    .withMessage('Valid class ID is required'),
  
  body('section')
    .trim()
    .notEmpty()
    .withMessage('Section is required'),
  
  body('academicYear')
    .trim()
    .notEmpty()
    .withMessage('Academic year is required')
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('Academic year must be in format YYYY-YYYY'),

  // Parent Information
  body('parentInfo.father.name')
    .trim()
    .notEmpty()
    .withMessage('Father\'s name is required'),
  
  body('parentInfo.father.phone')
    .trim()
    .notEmpty()
    .withMessage('Father\'s phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),
  
  body('parentInfo.mother.name')
    .trim()
    .notEmpty()
    .withMessage('Mother\'s name is required'),
  
  body('parentInfo.mother.phone')
    .trim()
    .notEmpty()
    .withMessage('Mother\'s phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),

  // Optional Guardian Information
  body('parentInfo.guardian.phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Invalid phone number format'),
  
  body('parentInfo.guardian.email')
    .optional()
    .isEmail()
    .withMessage('Invalid guardian email format')
    .normalizeEmail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateAttendanceRecord = [
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  
  body('status')
    .isIn(['present', 'absent', 'late', 'excused'])
    .withMessage('Invalid attendance status'),
  
  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Remarks cannot exceed 500 characters'),
];

export const validateAcademicRecord = [
  body('year')
    .trim()
    .notEmpty()
    .withMessage('Academic year is required'),
  
  body('term')
    .trim()
    .notEmpty()
    .withMessage('Term is required'),
  
  body('subjects.*.subject')
    .isMongoId()
    .withMessage('Valid subject ID is required'),
  
  body('subjects.*.marks')
    .isNumeric()
    .withMessage('Marks must be a number')
    .custom((value) => {
      if (value < 0 || value > 100) {
        throw new Error('Marks must be between 0 and 100');
      }
      return true;
    }),
]; 