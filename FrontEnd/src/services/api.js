import axios from 'axios';

/**
 * Shared Axios instance — all service modules use this.
 *
 * Key change: `withCredentials: true` ensures the browser sends
 * the HttpOnly `jwt` cookie with every request automatically.
 */
const api = axios.create({
  baseURL: '/api', // Proxied by Vite to localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 👈 Send cookies with every request
});

/**
 * Global response interceptor — handles 401 (session expired).
 *
 * If any API call gets a 401, the user's session is no longer valid.
 * We redirect them to /login unless they're already on an auth page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      // Avoid redirect loops on auth pages
      if (!path.includes('/login') && !path.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
