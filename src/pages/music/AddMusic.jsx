import { useState, useEffect } from 'react'
import { 
  Plus, 
  Music,
  X,
  Upload,
  User,
  Tag,
  Calendar,
  FileAudio,
  Sparkles,
  Loader2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import {  uploadMusic, updateMusic, getSubcategories, getAlbums } from '../../api/api'

// AddMusic Component
const AddMusic = ({ isOpen, onClose, onAddMusic, editingMusic }) => {
  const [formData, setFormData] = useState({
    title: '',
    artists: [''],
    description: '',
    albumId: '',
    subCategoryId: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState([])
  const [albums, setAlbums] = useState([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData()
    }
  }, [isOpen])

  useEffect(() => {
    if (editingMusic) {
      setFormData({
        title: editingMusic.title || '',
        artists: editingMusic.artists || [''],
        description: editingMusic.description || '',
        albumId: editingMusic.albumId || '',
        subCategoryId: editingMusic.subCategoryId || ''
      })
      if (editingMusic.image) {
        setImagePreview(editingMusic.image)
      }
    } else {
      resetForm()
    }
  }, [editingMusic, isOpen])

  const fetchDropdownData = async () => {
    setLoadingDropdowns(true)
    try {
      const [subCategoriesData, albumsData] = await Promise.all([
        getSubcategories(),
        getAlbums()
      ])
      setSubCategories(subCategoriesData?.data?.data || [])
      setAlbums(albumsData?.data?.data || [])
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
      alert('Failed to load subcategories and albums')
    } finally {
      setLoadingDropdowns(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      artists: [''],
      description: '',
      albumId: '',
      subCategoryId: ''
    })
    setImageFile(null)
    setAudioFile(null)
    setImagePreview(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArtistChange = (index, value) => {
    const newArtists = [...formData.artists]
    newArtists[index] = value
    setFormData(prev => ({
      ...prev,
      artists: newArtists
    }))
  }

  const addArtistField = () => {
    setFormData(prev => ({
      ...prev,
      artists: [...prev.artists, '']
    }))
  }

  const removeArtistField = (index) => {
    if (formData.artists.length > 1) {
      const newArtists = formData.artists.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        artists: newArtists
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/')) {
        setAudioFile(file)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.artists[0] || !formData.albumId || !formData.subCategoryId) {
      alert('Please fill in all required fields')
      return
    }

    if (!editingMusic && !audioFile) {
      alert('Please upload an audio file')
      return
    }
    
    setLoading(true)
    
    try {
      const submitFormData = new FormData()
      submitFormData.append('title', formData.title)
      
      // Add all artists
      formData.artists.filter(artist => artist.trim()).forEach(artist => {
        submitFormData.append('artists', artist.trim())
      })
      
      submitFormData.append('description', formData.description)
      submitFormData.append('albumId', formData.albumId)
      submitFormData.append('subCategoryId', formData.subCategoryId)
      
      if (imageFile) {
        submitFormData.append('image', imageFile)
      }
      
      if (audioFile) {
        submitFormData.append('audio', audioFile)
      }
      
      if (editingMusic) {
        await updateMusic(editingMusic._id || editingMusic.id, submitFormData)
      } else {
        await uploadMusic(submitFormData)
      }
      
      await onAddMusic()
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error saving music:', error)
      alert(error.response?.data?.message || error.message || 'Failed to save music')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed  transition-opacity bg-black/60"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingMusic ? 'Edit Music' : 'Add New Music'}
                  </h3>
                  <p className="text-white/80">Upload and organize your tracks</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                disabled={loading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                <ImageIcon className="inline h-4 w-4 mr-2" />
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Audio Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                <FileAudio className="inline h-4 w-4 mr-2" />
                Audio File {!editingMusic && '*'}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50'
                    : audioFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {audioFile ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto flex items-center justify-center">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{audioFile.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(audioFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {editingMusic ? 'Upload new audio (optional)' : 'Drop your audio file here'}
                      </p>
                      <p className="text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-2">Supports MP3, WAV, FLAC, AAC</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  <Music className="inline h-4 w-4 mr-2" />
                  Track Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter track title"
                  required
                />
              </div>

              {/* Album Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Album *
                </label>
                <select
                  name="albumId"
                  value={formData.albumId}
                  onChange={handleChange}
                  disabled={loadingDropdowns}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  required
                >
                  <option value="">
                    {loadingDropdowns ? 'Loading albums...' : 'Select an album'}
                  </option>
                  {albums.map((album) => (
                    <option key={album._id || album.id} value={album._id || album.id}>
                      {album.title || album.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Artists */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                <User className="inline h-4 w-4 mr-2" />
                Artists *
              </label>
              {formData.artists.map((artist, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => handleArtistChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Artist ${index + 1}`}
                    required={index === 0}
                  />
                  {formData.artists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArtistField(index)}
                      className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addArtistField}
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Another Artist
              </button>
            </div>

            {/* SubCategory Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                <Tag className="inline h-4 w-4 mr-2" />
                SubCategory *
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleChange}
                disabled={loadingDropdowns}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                required
              >
                <option value="">
                  {loadingDropdowns ? 'Loading subcategories...' : 'Select a subcategory'}
                </option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id || subCategory.id} value={subCategory._id || subCategory.id}>
                    {subCategory.name || subCategory.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter track description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingDropdowns}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingMusic ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {editingMusic ? 'Update Music' : 'Add Music'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddMusic

// Main MusicList Component