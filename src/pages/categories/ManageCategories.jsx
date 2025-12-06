import { useState, useEffect } from 'react'
import {
  Music,
  Heart,
  Globe,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Tag,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import CategoryModal from './CategoryModal'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/api'

// Main Component
const ManageCategories = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [categories, setCategories] = useState([])
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch categories when page or limit changes
  useEffect(() => {
    fetchCategories()
  }, [currentPage, itemsPerPage])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Pass page and limit to API
      const response = await getCategories({ page: currentPage, limit: itemsPerPage })
      
      // Handle the API response structure
      let allCategories = []
      let pagination = {}
      
      if (response.data?.data) {
        // Structure from your API
        allCategories = Array.isArray(response.data.data) ? response.data.data : []
        pagination = {
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          page: response.data.page || 1,
          limit: response.data.limit || 10
        }
      } else if (Array.isArray(response.data)) {
        allCategories = response.data
      } else if (Array.isArray(response)) {
        allCategories = response
      }
      
      console.log('Fetched categories:', allCategories)
      
      // Filter to show only categories with images
      const categoriesWithImages = allCategories.filter(cat => cat && cat.image)
      
      setCategories(categoriesWithImages)
      setTotalItems(pagination.total || categoriesWithImages.length)
      setTotalPages(pagination.totalPages || Math.ceil(categoriesWithImages.length / itemsPerPage))
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentCategories = () => {
    let filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cat => 
        statusFilter === 'active' ? cat.isActive : !cat.isActive
      )
    }

    return filtered
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1) // Reset to first page
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleSaveCategory = async (formData) => {
    try {
      setActionLoading(true)
      
      if (editingCategory) {
        // Update existing category
        const response = await updateCategory(editingCategory._id || editingCategory.id, formData)
        const updatedCategory = response.data || response
        
        setCategories(prev => prev.map(cat =>
          (cat._id || cat.id) === (editingCategory._id || editingCategory.id) 
            ? { ...cat, ...updatedCategory } 
            : cat
        ))
      } else {
        // Create new category
        const response = await createCategory(formData)
        const newCategory = response.data || response
        
        if (newCategory.image) {
          setCategories(prev => [...prev, newCategory])
        }
      }

      setIsModalOpen(false)
      setEditingCategory(null)
      
      // Refresh categories to get the latest data
      await fetchCategories()
      
    } catch (err) {
      console.error('Error saving category:', err)
      alert(err.response?.data?.message || 'Failed to save category')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      setActionLoading(true)
      await deleteCategory(id)
      await fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      alert(err.response?.data?.message || 'Failed to delete category')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      setActionLoading(true)
      const category = categories.find(cat => (cat._id || cat.id) === id)
      
      // Create FormData for the update
      const formData = new FormData()
      formData.append('name', category.name)
      formData.append('description', category.description)
      formData.append('isActive', !category.isActive)
      
      await updateCategory(id, formData)
      setCategories(prev => prev.map(cat =>
        (cat._id || cat.id) === id ? { ...cat, isActive: !cat.isActive } : cat
      ))
    } catch (err) {
      console.error('Error toggling status:', err)
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(categories, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `categories-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting:', err)
      alert('Failed to export categories')
    }
  }

  const getTotalStats = () => {
    return {
      total: totalItems,
      active: categories.filter(c => c.isActive).length,
      inactive: categories.filter(c => !c.isActive).length,
    }
  }

  const stats = getTotalStats()
  const filteredCategories = getCurrentCategories()

  // Calculate display info
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Manage Categories</h1>
              <p className="text-white/80 text-lg">Organize your music library</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span className="font-semibold">{stats.total} Categories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{stats.active} Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleExport}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button 
                onClick={handleAddCategory}
                disabled={actionLoading}
                className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Categories</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchCategories}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({categories.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'active'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active ({categories.filter(c => c.isActive).length})
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    statusFilter === 'inactive'
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Inactive ({categories.filter(c => !c.isActive).length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2.5 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category._id || category.id}
                  className="relative group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-gray-200">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-gray-600">
                            {category.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description || 'No description available'}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {category.createdAt ? `Created: ${new Date(category.createdAt).toLocaleDateString()}` : 'No date'}
                    </span>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleStatus(category._id || category.id)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={category.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {category.isActive ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id || category.id)}
                        disabled={actionLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalItems > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Showing <span className="font-semibold text-gray-900">{startIndex}</span> to{' '}
                    <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalItems}</span> categories
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)

                      if (!showPage) {
                        // Show ellipsis
                        if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredCategories.length === 0 && !loading && (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first category.'}
                </p>
                <button 
                  onClick={handleAddCategory}
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  Add New Category
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
        type="Category"
        loading={actionLoading}
      />
    </div>
  )
}

export default ManageCategories;