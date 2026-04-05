

const { body, param, query, validationResult } = require('express-validator');


const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * User registration validation
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer']).withMessage('Invalid role'),
  validate
];

/**
 * User login validation
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Financial record creation validation
 */
const createRecordValidation = [
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .notEmpty().withMessage('Type is required')
    .isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 2 }).withMessage('Category must be at least 2 characters long'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('description')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim(),
  validate
];

/**
 * Financial record update validation
 */
const updateRecordValidation = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Category must be at least 2 characters long'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('description')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim(),
  validate
];

/**
 * User update validation
 */
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['admin', 'analyst', 'viewer']).withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Invalid status'),
  validate
];

/**
 * MongoDB ObjectId validation
 */
const idValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  validate
];

/**
 * Query filter validation for records
 */
const recordFilterValidation = [
  query('type')
    .optional()
    .isIn(['income', 'expense']).withMessage('Type must be either income or expense'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format'),
  query('category')
    .optional()
    .trim(),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createRecordValidation,
  updateRecordValidation,
  updateUserValidation,
  idValidation,
  recordFilterValidation
};
