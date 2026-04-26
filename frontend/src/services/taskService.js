import api from '../utils/axiosConfig';

export const taskService = {
  getAll: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
  exportCSV: () => api.get('/tasks/export', { responseType: 'blob' }),
};
