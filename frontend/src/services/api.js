import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.VITE_API_URL 
    ? (import.meta.env.VITE_API_URL.endsWith('/api/v1') 
      ? import.meta.env.VITE_API_URL 
      : `${import.meta.env.VITE_API_URL}/api/v1`)
    : 'http://localhost:8080/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMsg = 'Unable to process request.';
    
    if (error.code === 'ECONNABORTED') {
      errorMsg = 'Request timed out. Please check your connection and try again.';
      toast.error(errorMsg);
    } else if (!error.response) {
      errorMsg = 'Network error. Please make sure the backend server is running.';
      toast.error(errorMsg);
    } else {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Often validation errors, which are displayed under fields.
          // But if there is a general error message, toast it
          errorMsg = data.message || 'Invalid input data.';
          break;
        case 429:
          errorMsg = data.message || 'Too many requests. Please slow down and try again.';
          toast.error(errorMsg, { id: 'rate-limit' }); // Deduplicate toast
          break;
        case 404:
          errorMsg = data.message || 'Requested resource not found.';
          toast.error(errorMsg);
          break;
        case 500:
          errorMsg = data.message || 'Internal server error. Please try again later.';
          toast.error(errorMsg);
          break;
        default:
          errorMsg = data.message || 'An unexpected error occurred.';
          toast.error(errorMsg);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
