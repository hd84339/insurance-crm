import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Client API
export const clientAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getStats: () => api.get('/clients/stats/overview'),
  getPolicies: (id) => api.get(`/clients/${id}/policies`),
};

// Policy API
export const policyAPI = {
  getAll: (params) => api.get('/policies', { params }),
  getById: (id) => api.get(`/policies/${id}`),
  create: (data) => api.post('/policies', data),
  update: (id, data) => api.put(`/policies/${id}`, data),
  delete: (id) => api.delete(`/policies/${id}`),
  getStats: () => api.get('/policies/stats/overview'),
  getUpcomingRenewals: (days = 30) => api.get('/policies/renewal/upcoming', { params: { days } }),
  getMatured: () => api.get('/policies/maturity/list'),
};

// Claim API
export const claimAPI = {
  getAll: (params) => api.get('/claims', { params }),
  getById: (id) => api.get(`/claims/${id}`),
  create: (data) => api.post('/claims', data),
  update: (id, data) => api.put(`/claims/${id}`, data),
  updateStatus: (id, data) => api.patch(`/claims/${id}/status`, data),
  delete: (id) => api.delete(`/claims/${id}`),
  getStats: () => api.get('/claims/stats/overview'),
  getPending: () => api.get('/claims/pending/list'),
};

// Task API (Renamed from Reminder)
export const taskAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  complete: (id) => api.patch(`/tasks/${id}/complete`),
  snooze: (id, days) => api.patch(`/tasks/${id}/snooze`, { days }),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats/overview'),
  getUpcoming: (days = 7) => api.get(`/tasks/upcoming/${days}`),
  getOverdue: () => api.get('/tasks/overdue/list'),
};

// Target API
export const targetAPI = {
  getAll: (params) => api.get('/targets', { params }),
  getById: (id) => api.get(`/targets/${id}`),
  create: (data) => api.post('/targets', data),
  update: (id, data) => api.put(`/targets/${id}`, data),
  delete: (id) => api.delete(`/targets/${id}`),
  getStats: () => api.get('/targets/stats/overview'),
  getAgentActive: (agentId) => api.get(`/targets/agent/${agentId}/active`),
  getAgentPerformance: (agentId, period) => api.get(`/targets/agent/${agentId}/performance`, { params: { period } }),
};

// Report API
export const reportAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getPolicyReport: (params) => api.get('/reports/policies', { params }),
  getClaimReport: (params) => api.get('/reports/claims', { params }),
  getRenewalReport: (params) => api.get('/reports/renewals', { params }),
  getTargetReport: (params) => api.get('/reports/targets', { params }),
  getClientActivity: (params) => api.get('/reports/client-activity', { params }),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => {
    return api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAvatar: () => api.delete('/users/profile/avatar'),
};

export default api;
