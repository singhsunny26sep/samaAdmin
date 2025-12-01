import { useState, useEffect } from 'react'
import {
  Layers,
  X,
  ChevronDown,
} from 'lucide-react'


// SubcategoryModal Component
const SubcategoryModal = ({ isOpen, onClose, onSave, subcategory, loading, categories, selectedCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: ''
  })
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null) // Store actual file
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (subcategory) {
      setFormData({
        name: subcategory.name || '',
        description: subcategory.description || '',
        categoryId: subcategory.categoryId || selectedCategory || ''
      })
      setImagePreview(subcategory.image || '')
      setImageFile(null) // Clear file when editing
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: selectedCategory || ''
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [subcategory, isOpen, selectedCategory])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    // Store the actual file
    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setUploading(false)
    }

    reader.onerror = () => {
      alert('Failed to read image file')
      setUploading(false)
    }

    reader.readAsDataURL(file)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    if (!formData.categoryId) {
      alert('Please select a category')
      return
    }
    
    if (!formData.name.trim()) {
      alert('Please enter subcategory name')
      return
    }
    
    if (!formData.description.trim()) {
      alert('Please enter subcategory description')
      return
    }
    
    // For new subcategory, require file
    if (!subcategory && !imageFile) {
      alert('Please upload an image')
      return
    }
    
    // Pass the file object, not base64
    onSave({ 
      ...formData, 
      imageFile: imageFile, // Pass actual file
      image: imagePreview // Keep preview for display
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {subcategory ? 'Edit Subcategory' : 'Add Subcategory'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parent Category *
              </label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white"
                  disabled={loading || !!subcategory}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {subcategory && (
                <p className="text-xs text-gray-500 mt-1">Category cannot be changed when editing</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter subcategory name (e.g., Bollywood Action)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter subcategory description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Image {!subcategory && '*'}
              </label>
              
              <div className='flex flex-col items-center gap-4'>
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Layers className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                <label className="cursor-pointer">
                  <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <span>{uploading ? 'Uploading...' : imagePreview ? 'Change Image' : 'Upload Image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading || loading}
                  />
                </label>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading || uploading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading || !formData.name.trim() || !formData.description.trim() || !formData.categoryId || (!subcategory && !imageFile)}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : subcategory ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubcategoryModal;