import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific HTTP error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            toast.error('Your session has expired. Please log in again.');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden
          toast.error('You do not have permission to access this resource.');
          break;
        case 404:
          // Not found
          toast.error('The requested resource was not found.');
          break;
        case 500:
          // Server error
          toast.error('An internal server error occurred. Please try again later.');
          break;
        default:
          // Other errors
          if (error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('An unexpected error occurred.');
          }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Other errors
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;