const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const {
  getOrganizations,
  getOrganizationMembers,
  getOrganizationProjects,
  createProject,
} = require('../controllers/organizationController');

const router = express.Router();
router.use(authenticate);
router.get('/', getOrganizations);
router.get('/:organizationId/members', getOrganizationMembers);
router.get('/:organizationId/projects', getOrganizationProjects);
router.post('/:organizationId/projects', createProject);

module.exports = router;

