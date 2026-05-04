import api from './api';

/**
 * Auth Service — Handles all authentication-related API calls.
 *
 * Centralises auth endpoints so components never import axios directly.
 * Uses the shared `api` instance (which sends cookies automatically).
 *
 * ⚠️ Cookie-based auth: The server sets an HttpOnly cookie on login/signup.
 *    We do NOT receive or store any token in the frontend.
 */
export const authService = {
  /**
   * Register a new user.
   * The server sets an HttpOnly JWT cookie automatically.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ status: string, data: { user: object } }>}
   */
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  /**
   * Log in an existing user.
   * The server sets an HttpOnly JWT cookie automatically.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ status: string, data: { user: object } }>}
   */
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  /**
   * Get the currently authenticated user's profile.
   * Uses the HttpOnly cookie to authenticate the request.
   * @returns {Promise<{ status: string, data: { user: object } }>}
   */
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Log out — clears the HttpOnly cookie on the server.
   * @returns {Promise<{ status: string }>}
   */
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  // Future: forgotPassword, resetPassword, etc.
};
