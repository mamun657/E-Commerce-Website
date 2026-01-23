import axios from 'axios';

// Prefer configured API URL, but fall back to the default backend dev port (5000).
// If your backend runs on a different port (see backend logs), set VITE_API_URL in frontend/.env.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('token');
};

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const persistedToken = getStoredToken();
if (persistedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${persistedToken}`;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;

      // Prevent auto logout during checkout flow
      // This allows checkout validation errors without forcing logout
      if (!path.includes('checkout')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        delete api.defaults.headers.common.Authorization;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
