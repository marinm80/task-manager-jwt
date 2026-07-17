const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const {
  getProject,
  updateProject,
  getProjectMembers,
  upsertProjectMember,
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
} = require('../controllers/projectController');

const router = express.Router();
router.use(authenticate);
router.get('/:projectId', getProject);
router.patch('/:projectId', updateProject);
router.get('/:projectId/members', getProjectMembers);
router.put('/:projectId/members', upsertProjectMember);
router.get('/:projectId/tasks', getProjectTasks);
router.post('/:projectId/tasks', createProjectTask);
router.patch('/:projectId/tasks/:taskId', updateProjectTask);
router.delete('/:projectId/tasks/:taskId', deleteProjectTask);

module.exports = router;

