const express = require('express');
const { getUsers, getUserTasks, updateUserRole } = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/users', getUsers);
router.get('/users/:id/tasks', getUserTasks);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
