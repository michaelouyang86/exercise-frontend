import axios from 'axios';

const exerciseApiClient = axios.create({
  baseURL: import.meta.env.VITE_EXERCISE_API_URL
});

// Add a request interceptor to include the token in the headers
exerciseApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default exerciseApiClient;