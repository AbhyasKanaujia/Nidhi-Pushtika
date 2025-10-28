const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const { body, param } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const {
  listUsers,
  createUser,
  updateUser,
  disableUser
} = require('../controllers/userController');

router.use(requireRole('admin'));

router.get('/', listUsers);

router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'editor', 'reader']).withMessage('Role must be admin, editor, or reader')
  ],
  validateRequest,
  createUser
);

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid user ID is required'),
    body('name').optional().isString().notEmpty().withMessage('Name must be a non-empty string'),
    body('role').optional().isIn(['admin', 'editor', 'reader']).withMessage('Role must be admin, editor, or reader'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  updateUser
);

router.delete(
  '/:id',
  [
    param('id').isMongoId().withMessage('Valid user ID is required')
  ],
  validateRequest,
  disableUser
);

module.exports = router;
