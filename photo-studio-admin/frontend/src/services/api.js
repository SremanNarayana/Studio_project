import axios from 'axios';

const api = axios.create({
  // Vite's /api proxy is used locally. Production points directly to Render.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Normalize errors so every caller can just read err.message
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    const errors = err.response?.data?.errors || null;
    return Promise.reject({ message, errors, statusCode: err.response?.status });
  }
);

export default api;
