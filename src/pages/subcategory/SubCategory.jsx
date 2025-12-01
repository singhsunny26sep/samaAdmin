import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Layers,
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
  ChevronDown,
} from 'lucide-react'
import { getCategories, getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from '../../api/api'
import SubcategoryModal from './SubcategoryModal'

// Utility function to normalize API responses
const normalizeArray = (response) => {
  if (Array.isArray(response)) return response
  if (response?.data) {
    if (Array.isArray(response.data)) return response.data
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data
  }
  if (response?.categories && Array.isArray(response.categories)) return response.categories
  if (response?.subcategories && Array.isArray(response.subcategories)) return response.subcategories
  return []
}

// Utility function to get entity ID
const getId = (entity) => entity?._id || entity?.id

// Stats Card Component
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5" />
    <span className="font-semibold">{value} {label}</span>
  </div>
)

// Filter Button Component
const FilterButton = ({ active, onClick, children, gradient, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active
        ? `${gradient} text-white shadow-lg`
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children} ({count})
  </button>
)

// Subcategory Card Component
const SubcategoryCard = ({ subcategory, onEdit, onDelete, onToggleStatus, disabled }) => (
  <div className="relative group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-gray-200 flex-shrink-0">
          {subcategory.image ? (
            <img src={subcategory.image} alt={subcategory.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-gray-600">
              {subcategory.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-gray-900 truncate">{subcategory.name}</h3>
          <p className="text-xs text-blue-600 font-medium truncate">{subcategory.categoryName}</p>
        </div>
      </div>
      
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
        subcategory.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {subcategory.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>

    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
      {subcategory.description || 'No description available'}
    </p>

    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <span className="text-xs text-gray-500">
        {subcategory.createdAt ? `Created: ${new Date(subcategory.createdAt).toLocaleDateString()}` : 'No date'}
      </span>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleStatus(subcategory)}
          disabled={disabled}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={subcategory.isActive ? 'Deactivate' : 'Activate'}
        >
          {subcategory.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
        </button>
        <button
          onClick={() => onEdit(subcategory)}
          disabled={disabled}
          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(subcategory)}
          disabled={disabled}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
)

// Main Component
const ManageSubcategories = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  // Fetch data on mount
  useEffect(() => {
    fetchCategoriesAndSubcategories()
  }, [])

  const fetchCategoriesAndSubcategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const categoriesResponse = await getCategories()
      const allCategories = normalizeArray(categoriesResponse).filter(cat => cat?.image)
      setCategories(allCategories)
      
      // Fetch subcategories in parallel
      const subcategoryPromises = allCategories.map(async (category) => {
        const categoryId = getId(category)
        if (!categoryId) return []
        
        try {
          const subResponse = await getSubcategories(categoryId)
          const subs = normalizeArray(subResponse).filter(sub => sub?.image)
          
          return subs.map(sub => ({
            ...sub,
            categoryId,
            categoryName: category.name
          }))
        } catch (err) {
          console.error(`Error fetching subcategories for ${category.name}:`, err)
          return []
        }
      })
      
      const results = await Promise.all(subcategoryPromises)
      setSubcategories(results.flat())
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  // Memoized filtered subcategories
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter(sub => {
      const matchesSearch = 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || sub.categoryId === categoryFilter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? sub.isActive : !sub.isActive)
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [subcategories, searchTerm, categoryFilter, statusFilter])

  // Memoized stats
  const stats = useMemo(() => ({
    total: subcategories.length,
    active: subcategories.filter(c => c.isActive).length,
    inactive: subcategories.filter(c => !c.isActive).length,
  }), [subcategories])

  // Handlers
  const handleAddSubcategory = useCallback(() => {
    setEditingSubcategory(null)
    setIsModalOpen(true)
  }, [])

  const handleEditSubcategory = useCallback((subcategory) => {
    setEditingSubcategory(subcategory)
    setIsModalOpen(true)
  }, [])

  const handleSaveSubcategory = async (formData) => {
    try {
      setActionLoading(true)
      
      const subcategoryData = {
        name: formData.name,
        description: formData.description,
      }

      if (editingSubcategory) {
        await updateSubcategory(
          formData.categoryId, 
          getId(editingSubcategory), 
          subcategoryData
        )
        
        setSubcategories(prev => prev.map(sub =>
          getId(sub) === getId(editingSubcategory) 
            ? { ...sub, ...formData }
            : sub
        ))
      } else {
        const response = await createSubcategory(formData.categoryId, subcategoryData)
        const newSubcategory = response.data || response
        const category = categories.find(cat => getId(cat) === formData.categoryId)
        
        setSubcategories(prev => [...prev, {
          ...newSubcategory,
          image: formData.image,
          categoryId: formData.categoryId,
          categoryName: category?.name || 'Unknown'
        }])
      }

      setIsModalOpen(false)
      setEditingSubcategory(null)
    } catch (err) {
      console.error('Error saving subcategory:', err)
      alert(err.response?.data?.message || 'Failed to save subcategory')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteSubcategory = async (subcategory) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return

    try {
      setActionLoading(true)
      await deleteSubcategory(subcategory.categoryId, getId(subcategory))
      setSubcategories(prev => prev.filter(sub => getId(sub) !== getId(subcategory)))
    } catch (err) {
      console.error('Error deleting subcategory:', err)
      alert(err.response?.data?.message || 'Failed to delete subcategory')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (subcategory) => {
    try {
      setActionLoading(true)
      const updatedData = {
        name: subcategory.name,
        description: subcategory.description,
        image: subcategory.image,
        isActive: !subcategory.isActive
      }
      
      await updateSubcategory(subcategory.categoryId, getId(subcategory), updatedData)
      setSubcategories(prev => prev.map(sub =>
        getId(sub) === getId(subcategory) 
          ? { ...sub, isActive: !sub.isActive } 
          : sub
      ))
    } catch (err) {
      console.error('Error toggling status:', err)
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = useCallback(() => {
    try {
      const dataStr = JSON.stringify(subcategories, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `subcategories-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting:', err)
      alert('Failed to export subcategories')
    }
  }, [subcategories])

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Manage Subcategories</h1>
              <p className="text-white/80 text-lg">Organize your content with detailed subcategories</p>
              <div className="flex items-center gap-6 mt-4">
                <StatCard icon={Layers} label="Subcategories" value={stats.total} />
                <StatCard icon={CheckCircle} label="Active" value={stats.active} />
                <StatCard icon={Tag} label="Categories" value={categories.length} />
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
                onClick={handleAddSubcategory}
                disabled={actionLoading}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Subcategory
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Data</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchCategoriesAndSubcategories}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading subcategories...</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <FilterButton 
                    active={statusFilter === 'all'} 
                    onClick={() => setStatusFilter('all')}
                    gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
                    count={subcategories.length}
                  >
                    All
                  </FilterButton>
                  <FilterButton 
                    active={statusFilter === 'active'} 
                    onClick={() => setStatusFilter('active')}
                    gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                    count={stats.active}
                  >
                    Active
                  </FilterButton>
                  <FilterButton 
                    active={statusFilter === 'inactive'} 
                    onClick={() => setStatusFilter('inactive')}
                    gradient="bg-gradient-to-r from-gray-500 to-slate-500"
                    count={stats.inactive}
                  >
                    Inactive
                  </FilterButton>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subcategories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 py-2.5 w-full lg:w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={getId(cat)} value={getId(cat)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {categoryFilter !== 'all' && (
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {filteredSubcategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Layers className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No subcategories found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new subcategory</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubcategories.map((subcategory) => (
                  <SubcategoryCard
                    key={getId(subcategory)}
                    subcategory={subcategory}
                    onEdit={handleEditSubcategory}
                    onDelete={handleDeleteSubcategory}
                    onToggleStatus={handleToggleStatus}
                    disabled={actionLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SubcategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingSubcategory(null)
          }}
          onSave={handleSaveSubcategory}
          categories={categories}
          editingSubcategory={editingSubcategory}
          loading={actionLoading}
        />
      )}
    </div>
  )
}

export default ManageSubcategories