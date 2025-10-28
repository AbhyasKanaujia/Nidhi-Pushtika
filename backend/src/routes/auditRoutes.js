const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const { query, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { getAuditEntries } = require('../controllers/auditController');

router.use(requireRole('admin'));

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    query('transactionId').optional().isMongoId().withMessage('Valid transaction ID is required'),
    query('userId').optional().isMongoId().withMessage('Valid user ID is required'),
    query('action').optional().isIn(['create', 'update', 'soft-delete', 'restore']).withMessage('Invalid action'),
    query('from').optional().isISO8601().toDate().withMessage('From must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('To must be a valid date')
  ],
  validateRequest,
  getAuditEntries
);

module.exports = router;
