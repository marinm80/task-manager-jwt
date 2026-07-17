import api from '../utils/axiosConfig';

const projectService = {
  getOrganizations: () => api.get('/organizations'),
  getProjects: (organizationId) => api.get(`/organizations/${organizationId}/projects`),
  createProject: (organizationId, data) => api.post(`/organizations/${organizationId}/projects`, data),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  updateProject: (projectId, data) => api.patch(`/projects/${projectId}`, data),
  getProjectTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  createProjectTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  updateProjectTask: (projectId, taskId, data) => api.patch(`/projects/${projectId}/tasks/${taskId}`, data),
};

export default projectService;

