const express = require('express');
const exportController = require('../controllers/exportController');
const requireRole = require('../middleware/requireRole');
const { query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get(
  '/excel',
  requireRole(['admin', 'editor', 'reader']),
  [
    query('from').optional().isISO8601().toDate().withMessage('From must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('To must be a valid date'),
    query('includeDeleted').optional().isBoolean().withMessage('includeDeleted must be boolean'),
    query('columns').optional().isString(),
    query('includeSummarySheet').optional().isBoolean().withMessage('includeSummarySheet must be boolean'),
    query('fileName').optional().isString()
  ],
  validateRequest,
  exportController.exportExcel
);

router.get(
  '/pdf',
  requireRole(['admin', 'editor', 'reader']),
  [
    query('from').optional().isISO8601().toDate().withMessage('From must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('To must be a valid date'),
    query('includeDeleted').optional().isBoolean().withMessage('includeDeleted must be boolean'),
    query('mode').optional().isIn(['summary', 'full']).withMessage('Mode must be summary or full')
  ],
  validateRequest,
  exportController.exportPdf
);

module.exports = router;
