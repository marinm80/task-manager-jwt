import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axiosConfig';
import { refreshSession } from '../../services/sessionService';

export const bootstrapSession = createAsyncThunk(
  'auth/bootstrapSession',
  async () => refreshSession(),
  {
    condition: (_, { getState }) => {
      const { initialized, initializing } = getState().auth;
      return !initialized && !initializing;
    },
  }
);

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  try {
    await api.post('/auth/logout');
  } finally {
    dispatch(logout());
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
    initialized: false,
    initializing: false,
  },
  reducers: {
    setAccessToken: (state, action) => { state.accessToken = action.payload; },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.initialized = true;
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(bootstrapSession.pending, (state) => {
        state.initializing = true;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.initializing = false;
        state.initialized = true;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.initializing = false;
        state.initialized = true;
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
