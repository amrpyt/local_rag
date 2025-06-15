// API client configuration
import axios from 'axios';

// Create an axios instance with the backend URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Direct connection to the backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 