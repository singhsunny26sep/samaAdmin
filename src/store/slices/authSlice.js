import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser } from '../../api/api'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role = 'admin' }, { rejectWithValue }) => {
    try {
      const response = await loginUser({ 
        type: 'email',
        email,
        password,
        role,
        fcmToken: ''
      })
      return response
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        'Login failed'
      return rejectWithValue(errorMessage)
    }
  }
)

// Simple synchronous logout - no API call needed
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Just return success - all cleanup happens in the reducer
    return true
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        const user = action.payload.data?.user || action.payload.user
        const token = action.payload.data?.token || action.payload.token
        
        state.user = user
        state.token = token
        state.isAuthenticated = true
        state.error = null
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        state.isLoading = false
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
  },
})

export const { clearError, setCredentials, clearAuth } = authSlice.actions
export default authSlice.reducer