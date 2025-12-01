import { useState, useEffect } from 'react'
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
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { getCategories, getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from '../../api/api'
import SubcategoryModal from './SubcategoryModal'

const ManageSubcategories = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    fetchCategoriesAndSubcategories()
  }, [])

  const fetchCategoriesAndSubcategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const categoriesResponse = await getCategories()
      
      let allCategories = []
      if (Array.isArray(categoriesResponse)) {
        allCategories = categoriesResponse
      } else if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        allCategories = categoriesResponse.data
      } else if (categoriesResponse.data && categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
        allCategories = categoriesResponse.data.data
      } else if (categoriesResponse.categories && Array.isArray(categoriesResponse.categories)) {
        allCategories = categoriesResponse.categories
      }
      
      const categoriesWithImages = allCategories.filter(cat => cat && cat.image)
      setCategories(categoriesWithImages)
      
      const allSubcategories = []
      const seenSubcategoryIds = new Set() // Track unique subcategories
      
      for (const category of categoriesWithImages) {
        if (category && (category._id || category.id)) {
          try {
            const subResponse = await getSubcategories(category._id || category.id)
            
            let subs = []
            if (Array.isArray(subResponse)) {
              subs = subResponse
            } else if (subResponse.data && Array.isArray(subResponse.data)) {
              subs = subResponse.data
            } else if (subResponse.data && subResponse.data.data && Array.isArray(subResponse.data.data)) {
              subs = subResponse.data.data
            } else if (subResponse.subcategories && Array.isArray(subResponse.subcategories)) {
              subs = subResponse.subcategories
            }
            
            subs.forEach(sub => {
              if (sub && sub.image) {
                const subId = sub._id || sub.id
                // Only add if we haven't seen this subcategory before
                if (!seenSubcategoryIds.has(subId)) {
                  seenSubcategoryIds.add(subId)
                  allSubcategories.push({
                    ...sub,
                    categoryId: category._id || category.id,
                    categoryName: category.name
                  })
                }
              }
            })
          } catch (err) {
            console.error(`Error fetching subcategories for category ${category.name}:`, err)
          }
        }
      }
      
      setSubcategories(allSubcategories)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const filteredSubcategories = subcategories.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.description && sub.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.categoryName && sub.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddSubcategory = () => {
    setEditingSubcategory(null)
    setIsModalOpen(true)
  }

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory)
    setIsModalOpen(true)
  }

  const handleSaveSubcategory = async (formData) => {
    try {
      setActionLoading(true)
      
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      
      // Only append image file if it exists (new upload)
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile)
      }

      if (editingSubcategory) {
        await updateSubcategory(
          formData.categoryId, 
          editingSubcategory._id || editingSubcategory.id, 
          submitData
        )
        
        setSubcategories(prev => prev.map(sub =>
          (sub._id || sub.id) === (editingSubcategory._id || editingSubcategory.id) 
            ? { ...sub, name: formData.name, description: formData.description, image: formData.image || sub.image }
            : sub
        ))
      } else {
        const response = await createSubcategory(formData.categoryId, submitData)
        const newSubcategory = response.data || response
        
        const category = categories.find(cat => 
          (cat._id || cat.id) === formData.categoryId
        )
        
        setSubcategories(prev => [...prev, {
          ...newSubcategory,
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
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return
    }

    try {
      setActionLoading(true)
      await deleteSubcategory(subcategory.categoryId, subcategory._id || subcategory.id)
      setSubcategories(prev => prev.filter(sub => (sub._id || sub.id) !== (subcategory._id || subcategory.id)))
    } catch (err) {
      console.error('Error deleting subcategory:', err)
      alert(err.response?.data?.message || 'Failed to delete subcategory')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = () => {
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
  }

  const activeCount = subcategories.filter(c => c.isActive).length

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
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  <span className="font-semibold">{subcategories.length} Subcategories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">{activeCount} Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  <span className="font-semibold">{categories.length} Categories</span>
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
        {/* Error Message */}
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

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading subcategories...</p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="mb-6 flex justify-end">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subcategories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2.5 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            {/* Subcategories Grid */}
            {filteredSubcategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Layers className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No subcategories found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or add a new subcategory</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubcategories.map((subcategory) => (
                  <div
                    key={subcategory._id || subcategory.id}
                    className="relative group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
                  >
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
                        subcategory.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
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
                          onClick={() => handleEditSubcategory(subcategory)}
                          disabled={actionLoading}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(subcategory)}
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