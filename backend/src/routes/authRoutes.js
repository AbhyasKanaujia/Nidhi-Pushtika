const express = require('express');
const router = express.Router();
const { login, me, logout } = require('../controllers/authController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  login
);
router.get('/me', me);
router.post('/logout', logout);

module.exports = router;
