import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

// Trip API
export const tripAPI = {
  getTrips: () => api.get('/trips').then(res => res.data),
  getTripById: (id) => api.get(`/trips/${id}`).then(res => res.data),
  createTrip: (tripData) => api.post('/trips', tripData),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  getUserStats: () => api.get('/trips/stats').then(res => res.data),
  getAnalytics: (id) => api.get(`/trips/${id}/analytics`).then(res => res.data),
};

// Expense API
export const expenseAPI = {
  getExpenses: (tripId) => api.get(`/trips/${tripId}/expenses`).then(res => res.data),
  createExpense: (tripId, expenseData) => api.post(`/trips/${tripId}/expenses`, expenseData),
  updateExpense: (expenseId, expenseData) => api.put(`/expenses/${expenseId}`, expenseData),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
  scanReceipt: (file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post('/expenses/scan-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile').then(res => res.data),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Maps API
export const mapsAPI = {
  calculateRoute: (waypoints) => api.post('/maps/route', { waypoints }).then(res => res.data),
  searchPlaces: (query) => api.get(`/maps/places?q=${query}`).then(res => res.data),
};

export default api;