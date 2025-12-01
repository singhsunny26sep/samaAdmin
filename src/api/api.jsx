import axios from 'axios'
import { BASE_URL, ENDPOINTS } from './endpoints'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', // FIXED: Changed from multipart/form-data
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH APIs ====================
export const loginUser = async (credentials) => {
  return await api.post(ENDPOINTS.AUTH.LOGIN, credentials)
}

export const registerUser = async (userData) => {
  return await api.post(ENDPOINTS.AUTH.REGISTER, userData)
}

export const logoutUser = async () => {
  return await api.post(ENDPOINTS.AUTH.LOGOUT)
}

export const getUserProfile = async () => {
  return await api.get(ENDPOINTS.AUTH.PROFILE)
}

export const refreshToken = async () => {
  return await api.post(ENDPOINTS.AUTH.REFRESH)
}

// ==================== USER APIs ====================
export const getUsers = async (params) => {
  return await api.get(ENDPOINTS.USERS.LIST, { params })
}

export const getUserById = async (id) => {
  return await api.get(`${ENDPOINTS.USERS.BY_ID}/${id}`)
}

export const createUser = async (userData) => {
  return await api.post(ENDPOINTS.USERS.CREATE, userData)
}

export const updateUser = async (id, userData) => {
  return await api.put(`${ENDPOINTS.USERS.UPDATE}/${id}`, userData)
}

export const deleteUser = async (id) => {
  return await api.delete(`${ENDPOINTS.USERS.DELETE}/${id}`)
}

// ==================== MUSIC APIs ====================
export const getMusic = async (params) => {
  return await api.get(ENDPOINTS.MUSIC.LIST, { params })
}

export const getMusicById = async (id) => {
  return await api.get(`${ENDPOINTS.MUSIC.BY_ID}/${id}`)
}

export const uploadMusic = async (formData) => {
  return await api.post(ENDPOINTS.MUSIC.UPLOAD, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const updateMusic = async (id, musicData) => {
  return await api.put(`${ENDPOINTS.MUSIC.UPDATE}/${id}`, musicData)
}

export const deleteMusic = async (id) => {
  return await api.delete(`${ENDPOINTS.MUSIC.DELETE}/${id}`)
}

// ==================== CATEGORY APIs ====================
export const getCategories = async (params) => {
  return await api.get(ENDPOINTS.CATEGORIES.LIST, { params })
}

export const getCategoryById = async (id) => {
  return await api.get(`${ENDPOINTS.CATEGORIES.BY_ID}/${id}`)
}

export const createCategory = async (categoryData) => {
  return await api.post(ENDPOINTS.CATEGORIES.CREATE, categoryData,  {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const updateCategory = async (id, categoryData) => {
  return await api.put(`${ENDPOINTS.CATEGORIES.UPDATE}/${id}`, categoryData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteCategory = async (id) => {
  return await api.delete(`${ENDPOINTS.CATEGORIES.DELETE}/${id}`)
}

// ==================== SUBCATEGORY APIs ====================
export const getSubcategories = async (categoryId = null) => {
  if (categoryId) {
    return await api.get(`/subCategories/getAll`)
  }
  return await api.get(ENDPOINTS.SUBCATEGORIES.LIST)
}

export const getSubcategoryById = async (id) => {
  return await api.get(`${ENDPOINTS.SUBCATEGORIES.BY_ID}/${id}`)
}

export const getSubcategoriesByCategory = async (categoryId) => {
  return await api.get(`${ENDPOINTS.SUBCATEGORIES.BY_CATEGORY}/${categoryId}`)
}

export const createSubcategory = async (categoryId, subcategoryData) => {
  return await api.post(`/subCategories/${categoryId}/create`, subcategoryData)
}

export const updateSubcategory = async (categoryId, subcategoryId, subcategoryData) => {
  return await api.put(`${ENDPOINTS.SUBCATEGORIES.UPDATE}/${subcategoryId}`, subcategoryData)
}

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  return await api.delete(`${ENDPOINTS.SUBCATEGORIES.DELETE}/${subcategoryId}`)
}

// ==================== SUBSCRIPTION APIs ====================
export const getSubscriptionPlans = async (params) => {
  return await api.get(ENDPOINTS.SUBSCRIPTIONS.LIST, { params })
}

export const getSubscriptionPlanById = async (id) => {
  return await api.get(`${ENDPOINTS.SUBSCRIPTIONS.BY_ID}/${id}`)
}

// FIXED: Removed syntax error and now uses the api instance with JSON content-type
export const createSubscriptionPlan = async (planData) => {
  return await api.post(ENDPOINTS.SUBSCRIPTIONS.CREATE, planData)
}

// FIXED: Now uses JSON content-type from the api instance
export const updateSubscriptionPlan = async (id, planData) => {
  return await api.put(`${ENDPOINTS.SUBSCRIPTIONS.UPDATE}/${id}`, planData)
}

export const deleteSubscriptionPlan = async (id) => {
  return await api.delete(`${ENDPOINTS.SUBSCRIPTIONS.DELETE}/${id}`)
}

export const toggleSubscriptionStatus = async (id) => {
  return await api.patch(`${ENDPOINTS.SUBSCRIPTIONS.TOGGLE_STATUS}/${id}/toggle-status`)
}

// ==================== DASHBOARD APIs ====================
export const getDashboardStats = async () => {
  return await api.get(ENDPOINTS.DASHBOARD.STATS)
}

export const getDashboardAnalytics = async () => {
  return await api.get(ENDPOINTS.DASHBOARD.ANALYTICS)
}

export const getDashboardOverview = async () => {
  return await api.get(ENDPOINTS.DASHBOARD.OVERVIEW)
}

// ==================== FILE UPLOAD APIs ====================
export const uploadImage = async (formData) => {
  return await api.post(ENDPOINTS.UPLOAD.IMAGE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadAudio = async (formData) => {
  return await api.post(ENDPOINTS.UPLOAD.AUDIO, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadVideo = async (formData) => {
  return await api.post(ENDPOINTS.UPLOAD.VIDEO, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadFile = async (formData) => {
  return await api.post(ENDPOINTS.UPLOAD.FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}


// get Albums
export const getAlbums = async (params) => {
  return await api.get(ENDPOINTS.ALBUMS.LIST, { params })
}

// get Album by id
export const getAlbumById = async (id) => {
  return await api.get(`${ENDPOINTS.ALBUMS.BY_ID}/${id}`)
}

// create Album
export const createAlbum = async (albumData) => {
  return await api.post(ENDPOINTS.ALBUMS.CREATE, albumData)
}


// update Album

export const updateAlbum = async (id, albumData) => {
  return await api.put(`${ENDPOINTS.ALBUMS.UPDATE}/${id}`, albumData)
}

// delete Album
export const deleteAlbum = async (id) => {
  return await api.delete(`${ENDPOINTS.ALBUMS.DELETE}/${id}`)
}

// ==================== UTILITY FUNCTIONS ====================
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuthData = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export default api