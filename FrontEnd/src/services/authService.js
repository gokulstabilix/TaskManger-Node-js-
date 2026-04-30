import api from './api';

/**
 * Auth Service — Handles all authentication-related API calls.
 *
 * Centralises auth endpoints so components never import axios directly.
 * Uses the shared `api` instance (which is proxied to localhost:5000).
 */
export const authService = {
  /**
   * Register a new user.
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {Promise<{ status: string, token: string, data: { user: object } }>}
   */
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  // Future: login, forgotPassword, resetPassword, etc.
};
