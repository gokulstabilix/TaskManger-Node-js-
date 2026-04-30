import { useSelector, useDispatch } from 'react-redux';
import { signupUser, logout, clearAuthError } from '../store/authSlice';

/**
 * useAuth — A convenience hook that exposes every auth-related
 * value and action so pages/components never import Redux directly.
 *
 * Usage:
 *   const { user, isAuthenticated, signup, logout } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, status, error } = useSelector(
    (state) => state.auth
  );

  const signup = (userData) => dispatch(signupUser(userData));
  const logoutUser = () => dispatch(logout());
  const clearError = () => dispatch(clearAuthError());

  return {
    user,
    token,
    isAuthenticated,
    isLoading: status === 'loading',
    error,
    signup,
    logout: logoutUser,
    clearError,
  };
};
