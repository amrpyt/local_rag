import axios from 'axios';

// API client configuration
// Create an axios instance with the backend URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Direct connection to the backend
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Reduced timeout to 5 seconds for faster feedback
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('API Network Error: The server is unreachable or offline');
      return Promise.reject(new Error('The server is unreachable. Please check your connection or try again later.'));
    }
    
    // Handle specific HTTP status codes
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

export { apiClient }; 