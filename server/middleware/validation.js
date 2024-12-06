import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be either male, female, or other'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-]+$/)
    .withMessage('Please provide a valid phone number'),
  body('occupation')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Occupation must be at least 2 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  body('preferences.smoking')
    .optional()
    .isBoolean()
    .withMessage('Smoking preference must be a boolean'),
  body('preferences.pets')
    .optional()
    .isBoolean()
    .withMessage('Pets preference must be a boolean'),
  body('preferences.nightLife')
    .optional()
    .isBoolean()
    .withMessage('Night life preference must be a boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }
    next();
  }
];