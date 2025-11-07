import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, logoutUser } from '../../api/api'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role = 'admin' }, { rejectWithValue }) => {
    try {
      // loginUser already returns response.data due to interceptor
      const response = await loginUser({ 
        type: 'email',     // Required by API
        email,             // Required by API
        password,          // Required by API
        role,              // Required by API (defaults to 'admin')
        fcmToken: ''       // Required by API (empty string if not using push notifications)
      })
      
      // response is already the data object because of axios interceptor
      return response
    } catch (error) {
      // Better error handling
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        'Login failed'
      return rejectWithValue(errorMessage)
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutUser()
})

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
      // Save to localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      // Clear from localStorage
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
        // Adjust based on your API response structure
        // If API returns { success: true, data: { user, token } }
        const user = action.payload.data?.user || action.payload.user
        const token = action.payload.data?.token || action.payload.token
        
        state.user = user
        state.token = token
        state.isAuthenticated = true
        state.error = null
        
        // Save to localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.user = null
        state.token = null
        // Clear from localStorage on login failure
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
        // Clear from localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
  },
})

export const { clearError, setCredentials, clearAuth } = authSlice.actions
export default authSlice.reducer