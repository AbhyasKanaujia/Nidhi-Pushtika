const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const { getSummaryReport } = require('../controllers/reportController');

router.get(
  '/summary',
  [
    query('from').optional().isISO8601().toDate().withMessage('From must be a valid date'),
    query('to').optional().isISO8601().toDate().withMessage('To must be a valid date')
  ],
  validateRequest,
  getSummaryReport
);

module.exports = router;
