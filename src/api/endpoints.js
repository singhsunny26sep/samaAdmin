// export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.samasong.com/sama-music'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://samamusic.onrender.com/sama-music'

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users/get',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users',
    PROFILE: '/users/profile',
  },
  // Categories: {
  CATEGORIES: {
    LIST: '/categories/getAll',
    CREATE: '/categories/create',
    UPDATE: '/categories/update',
    DELETE: '/categories/delete',
  },
// Subcategories
  SUBCATEGORIES: {
    LIST: '/subCategories/getAll',
    CREATE: '/subCategories/create', // Backend should handle dynamic categoryId from request body
    UPDATE: '/subCategories/update',
    DELETE: '/subCategories/delete',
    BY_ID: '/subCategories',
    BY_CATEGORY: '/subCategories/category', // Optional: Get subcategories by category
  },

  MUSIC: {
    LIST: '/musics/getAll',
    UPLOAD: '/musics/add',
    UPDATE: '/musics',
    DELETE: '/musics',
    SEARCH: '/music/search',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ANALYTICS: '/dashboard/analytics',
  },

  // plans and

 // SUBSCRIPTION/PLANS ENDPOINTS
  SUBSCRIPTIONS: {
    LIST: '/subscriptions/getAll',           // GET - Get all subscription plans
    CREATE: '/subscriptions/add',          // POST - Create new plan
    UPDATE: '/subscriptions',          // PUT - Update plan by ID
    DELETE: '/subscriptions',          // DELETE - Delete plan by ID
    BY_ID: '/subscriptions',          // GET - Get single plan
    TOGGLE_STATUS: '/subscriptions'    // PATCH - Toggle active status
  },

  // ALBUMS ENDPOINTS
  ALBUMS: {
    LIST: '/albums/getAll',           // GET - Get all albums
    CREATE: '/albums/create',          // POST - Create new album
    UPDATE: '/albums/update',          // PUT - Update album by ID
    DELETE: '/albums/delete',          // DELETE - Delete album by ID
    BY_ID: '/albums',          // GET - Get single album
  },
}