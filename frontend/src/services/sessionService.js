import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cliente deliberadamente separado de `api`: un 401 del propio refresh no
// debe entrar al interceptor y provocar una segunda renovación recursiva.
export async function refreshSession() {
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
  return response.data;
}
