import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute — A route wrapper that gates access behind authentication.
 *
 * 🔒 Cookie-based auth:
 *  - While the app is verifying the session (authChecked = false),
 *    a loading spinner is shown to prevent a flash of the login page.
 *  - Once verified, authenticated users see the route; others are
 *    redirected to /login.
 *
 * Usage (in router):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, authChecked } = useAuth();

  // Session verification in progress — show loading spinner
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-primary-600" />
          <p className="text-sm text-gray-500 font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
