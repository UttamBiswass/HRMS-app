import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
console.log("API_BASE_URL", API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee API calls
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (employeeId) => api.get(`/employees/${employeeId}`),
  create: (data) => api.post('/employees', data),
  delete: (employeeId) => api.delete(`/employees/${employeeId}`),
  getDashboardSummary: () => api.get('/employees/dashboard/summary'),
};

// Attendance API calls
export const attendanceAPI = {
  getAll: (params = {}) => api.get('/attendance', { params }),
  getByEmployeeId: (employeeId) => api.get(`/attendance/${employeeId}`),
  create: (data) => api.post('/attendance', data),
  getStatsByEmployee: () => api.get('/attendance/stats/by-employee'),
  getStatsByEmployeeId: (employeeId) => api.get(`/attendance/stats/${employeeId}`),
};

export default api;
