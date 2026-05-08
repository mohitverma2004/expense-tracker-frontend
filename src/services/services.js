import axios from 'axios';

const API_URL = 'https://expense-tracker-api-wrxh.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const expenseAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: (params) => api.get('/expenses/summary', { params }),
  getMonthlyTotal: (params) => api.get('/expenses/monthly-total', { params }),
  getBudgetStatus: (params) => api.get('/expenses/budget-status', { params }),
  updateBudget: (data) => api.put('/expenses/budget', data),
  getTrends: () => api.get('/expenses/trends'),
  exportCSV: (params) => api.get('/expenses/export', { params, responseType: 'blob' }),
};

export default api;