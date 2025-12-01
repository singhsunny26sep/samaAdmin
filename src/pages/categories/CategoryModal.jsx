import React, { useState, useEffect } from 'react'
import { X, Upload, Image } from 'lucide-react'

const CategoryModal = ({ isOpen, onClose, onSave, category, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      })
      setImagePreview(category.image || '')
      setImageFile(null)
    } else {
      setFormData({
        name: '',
        description: ''
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [category, isOpen])

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

    // Store the actual file for form submission
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
    if (!formData.name.trim()) {
      alert('Please enter category name')
      return
    }
    
    if (!formData.description.trim()) {
      alert('Please enter category description')
      return
    }
    
    if (!imagePreview && !category) {
      alert('Please upload an image')
      return
    }
    
    // Create FormData object for multipart/form-data submission
    const submitData = new FormData()
    submitData.append('name', formData.name.trim())
    submitData.append('description', formData.description.trim())
    
    // Only append image if a new file was selected
    if (imageFile) {
      submitData.append('image', imageFile)
    }
    
    // Pass FormData directly
    onSave(submitData)
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
            {category ? 'Edit Category' : 'Add Category'}
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
            {/* Category Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            {/* Category Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Category Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image *
              </label>
              
              <div className='flex flex-col items-center'>
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                <div className="flex justify-center mt-3">
                  <label className="cursor-pointer">
                    <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                      <Upload className="h-4 w-4" />
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
              disabled={loading || uploading || !formData.name.trim() || !formData.description.trim() || (!imagePreview && !category)}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : category ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryModal