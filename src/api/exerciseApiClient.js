import axios from 'axios';

let exerciseApiClient;

export function getExerciseApiClient() {
  if (!exerciseApiClient) {
    exerciseApiClient = axios.create({
      baseURL: window.RUNTIME_CONFIG.EXERCISE_API_URL
    });

    // Add a request interceptor to include the token in the headers
    exerciseApiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return exerciseApiClient;
}
