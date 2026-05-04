import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

/**
 * Auth Slice — Manages authentication state via Redux Toolkit.
 *
 * 🔒 Cookie-based auth: The JWT is stored in an HttpOnly cookie
 *    managed entirely by the server. The frontend NEVER touches
 *    the token directly — no localStorage, no manual headers.
 *
 * On app load, `checkAuth` calls GET /users/me to verify the
 * session and restore the user state from the cookie.
 */

// ── Async Thunks ───────────────────────────────────────────────

/**
 * checkAuth — Called on app boot (and page refresh) to verify
 * whether the user has a valid session cookie.
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getMe();
      return { user: data.data.user };
    } catch (error) {
      // Not authenticated — this is expected for logged-out users
      return rejectWithValue('Not authenticated');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      // Cookie is set by the server automatically — no localStorage needed
      return { user: data.data.user };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Signup failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      // Cookie is set by the server automatically — no localStorage needed
      return { user: data.data.user };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

/**
 * logoutUser — Calls the backend to clear the HttpOnly cookie,
 * then resets the Redux auth state.
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error) {
      // Even if the API call fails, we still want to clear local state
      return rejectWithValue('Logout failed');
    }
  }
);

// ── Initial State ──────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,   // true after the initial /me check completes
  status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ── Slice ──────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Manually clear any lingering error messages. */
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Check Auth (app boot / page refresh) ──
      .addCase(checkAuth.pending, (state) => {
        // Don't set status to 'loading' here — this runs silently on boot
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true; // Check is done, user is just not logged in
      })

      // ── Signup ──
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ── Login ──
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // ── Logout ──
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear state even if the API call failed
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
