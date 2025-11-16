// services/api.js
import axios from 'axios';

// For local development without tunnel
// const API_BASE_URL = 'http://localhost:5000/';

// For ngrok tunnel
const API_BASE_URL = 'https://myuniqueapp.loca.lt/';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get users
  getUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Post data
  sendData: async (data) => {
    try {
      const response = await api.post('/api/data', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;