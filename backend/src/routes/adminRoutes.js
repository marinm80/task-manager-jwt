const express = require('express');
const {
  getUsers,
  getUserTasks,
  updateUserRole,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id/tasks', getUserTasks);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
