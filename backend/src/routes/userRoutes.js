const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole');
const {
  listUsers,
  createUser,
  updateUser,
  disableUser
} = require('../controllers/userController');

router.use(requireRole('admin'));

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', disableUser);

module.exports = router;
