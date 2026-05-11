import axios from 'axios';

// Determining the base URL based on the environment
const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

export const api = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Преобразуем ошибки сети в понятные сообщения
        if (!error.response) {
            return Promise.reject(new Error('Network error: Unable to connect to server'));
        }
        return Promise.reject(error);
    }
);
