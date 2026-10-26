import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public API for general product & category discovery
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dedicated Customer / User API
export const userApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('grocery_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Customer token expired or invalid
      localStorage.removeItem('grocery_user_token');
      localStorage.removeItem('grocery_user_data');
    }
    return Promise.reject(error);
  }
);

// Dedicated Admin API
export const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('grocery_admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Admin session expired or forbidden
      localStorage.removeItem('grocery_admin_token');
      localStorage.removeItem('grocery_admin_data');
    }
    return Promise.reject(error);
  }
);
