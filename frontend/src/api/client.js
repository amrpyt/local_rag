import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    // console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    // console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // console.error('API Response Error:', error.message);
    if (error.response) {
      // console.error('Error Status:', error.response.status);
      // console.error('Error Data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 