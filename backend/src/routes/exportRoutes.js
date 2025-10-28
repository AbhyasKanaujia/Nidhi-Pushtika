const express = require('express');
const exportController = require('../controllers/exportController');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.get('/excel', requireRole(["admin", "editor", "reader"]), exportController.exportExcel);
router.get('/pdf', requireRole(["admin", "editor", "reader"]), exportController.exportPdf);

module.exports = router;
