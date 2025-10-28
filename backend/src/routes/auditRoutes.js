const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const { getAuditEntries } = require('../controllers/auditController');

router.use(requireRole('admin'));

router.get('/', getAuditEntries);

module.exports = router;
