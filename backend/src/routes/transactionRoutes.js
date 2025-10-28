const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const fiscalLock = require('../middleware/fiscalLock');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  softDeleteTransaction,
  restoreTransaction
} = require('../controllers/transactionController');

// All roles can GET transactions, but with role-based filtering inside controller
router.get('/', requireRole(['admin', 'editor', 'reader']), getTransactions);

// POST, PATCH, DELETE require editor or admin role
router.post('/', requireRole(['admin', 'editor']), fiscalLock, createTransaction);
router.patch('/:id', requireRole(['admin', 'editor']), fiscalLock, updateTransaction);
router.delete('/:id', requireRole(['admin', 'editor']), fiscalLock, softDeleteTransaction);

// Restore is admin only
router.patch('/:id/restore', requireRole('admin'), restoreTransaction);

module.exports = router;
