const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const fiscalLock = require('../middleware/fiscalLock');
const { body, param, query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  softDeleteTransaction,
  restoreTransaction
} = require('../controllers/transactionController');

// All roles can GET transactions, but with role-based filtering inside controller
router.get(
  '/',
  requireRole(['admin', 'editor', 'reader']),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    query('from').optional().isISO8601().toDate().withMessage('From must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('To must be a valid date'),
    query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    query('search').optional().isString(),
    query('includeDeleted').optional().isBoolean().withMessage('includeDeleted must be boolean')
  ],
  validateRequest,
  getTransactions
);

// POST, PATCH, DELETE require editor or admin role
router.post(
  '/',
  requireRole(['admin', 'editor']),
  fiscalLock,
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('note').optional().isString(),
    body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date')
  ],
  validateRequest,
  createTransaction
);

router.patch(
  '/:id',
  requireRole(['admin', 'editor']),
  fiscalLock,
  [
    param('id').isMongoId().withMessage('Valid transaction ID is required'),
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
    body('note').optional().isString(),
    body('date').optional().isISO8601().toDate().withMessage('Date must be a valid date')
  ],
  validateRequest,
  updateTransaction
);

router.delete(
  '/:id',
  requireRole(['admin', 'editor']),
  fiscalLock,
  [
    param('id').isMongoId().withMessage('Valid transaction ID is required')
  ],
  validateRequest,
  softDeleteTransaction
);

// Restore is admin only
router.patch(
  '/:id/restore',
  requireRole('admin'),
  [
    param('id').isMongoId().withMessage('Valid transaction ID is required')
  ],
  validateRequest,
  restoreTransaction
);

module.exports = router;
