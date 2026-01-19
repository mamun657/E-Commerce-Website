import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const isBrowser = typeof window !== 'undefined';

const getStoredUser = () => {
  if (!isBrowser) return null;
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    localStorage.removeItem('user');
    console.error('Failed to parse stored user', error);
    return null;
  }
};

const getStoredToken = () => (isBrowser ? localStorage.getItem('token') : null);

const persistAuthData = (token, user) => {
  if (!isBrowser) return;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthData = () => {
  if (!isBrowser) return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common.Authorization;
};

const userFromStorage = getStoredUser();
let tokenFromStorage = getStoredToken();

if (tokenFromStorage === 'undefined' || tokenFromStorage === 'null') {
  clearAuthData();
  tokenFromStorage = null;
}

if (tokenFromStorage) {
  api.defaults.headers.common.Authorization = `Bearer ${tokenFromStorage}`;
}

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
  isAuthenticated: !!tokenFromStorage,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data || {};
      if (!token || !user) {
        throw new Error('Registration response missing authentication data');
      }
      persistAuthData(token, user);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      // DEBUG: Log complete response
      console.log('=== LOGIN THUNK DEBUG ===');
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      console.log('response.data.token:', response.data?.token);
      console.log('response.data.user:', response.data?.user);
      console.log('response.data.user.role:', response.data?.user?.role);
      console.log('========================');

      const { token, user } = response.data || {};
      if (!token || !user) {
        throw new Error('Login response missing authentication data');
      }

      console.log('Extracted user:', user);
      console.log('Extracted user.role:', user.role);

      persistAuthData(token, user);
      toast.success('Login successful!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      const user = response.data?.user;
      if (!user) {
        throw new Error('Unable to load profile');
      }
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthData();
  toast.success('Logged out successfully');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // DEBUG: Verify payload structure
        console.log('REGISTER PAYLOAD:', action.payload);
        console.log('USER OBJECT:', action.payload.user);
        console.log('USER ROLE:', action.payload.user?.role);

        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        // DEBUG: Verify payload structure
        console.log('LOGIN PAYLOAD:', action.payload);
        console.log('USER OBJECT:', action.payload.user);
        console.log('USER ROLE:', action.payload.user?.role);

        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
          ...action.payload,
          role: action.payload.role ?? state.user?.role,
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
