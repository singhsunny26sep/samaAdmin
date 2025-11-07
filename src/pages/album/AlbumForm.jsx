import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Save, Image as ImageIcon } from 'lucide-react';

// AlbumForm Component
const AlbumForm = ({ album, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    isActive: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (album) {
      setFormData({
        name: album.name || '',
        description: album.description || '',
        image: null,
        isActive: album.isActive || false
      });
      if (album.imageUrl) {
        setImagePreview(album.imageUrl);
      }
    }
  }, [album]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      formDataToSend.append('isActive', formData.isActive.toString());

      // API call would go here
      const endpoint = album 
        ? `https://your-api.com/albums/${album.id}` 
        : 'https://your-api.com/albums';
      
      const method = album ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Failed to ${album ? 'update' : 'create'} album`);
      }

      const result = await response.json();
      onSubmit(result);
      onClose();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {album ? 'Edit Album' : 'Add New Album'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Album Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hip hop 79"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hip hop songs for diwali"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Album Cover Image {!album && '*'}
              </label>
              <div className="mt-1">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!album}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* isActive Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {album ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {album ? 'Update Album' : 'Create Album'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AlbumManagement Component
const AlbumManagement = () => {
  const [albums, setAlbums] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch albums from API
  const fetchAlbums = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://your-api.com/albums');
      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }
      const data = await response.json();
      setAlbums(data);
    } catch (err) {
      setError(err.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Uncomment to fetch on mount
    // fetchAlbums();
    
    // Sample data for demo
    setAlbums([
      {
        id: 1,
        name: 'Hip hop 79',
        description: 'Hip hop songs for diwali',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        isActive: true
      },
      {
        id: 2,
        name: 'Classical Vibes',
        description: 'Best classical music collection',
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
        isActive: false
      }
    ]);
  }, []);

  const handleAddAlbum = () => {
    setSelectedAlbum(null);
    setShowForm(true);
  };

  const handleEditAlbum = (album) => {
    setSelectedAlbum(album);
    setShowForm(true);
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album?')) {
      return;
    }

    try {
      const response = await fetch(`https://your-api.com/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete album');
      }

      setAlbums(prev => prev.filter(album => album.id !== albumId));
    } catch (err) {
      alert(err.message || 'Failed to delete album');
    }
  };

  const handleFormSubmit = (newAlbum) => {
    if (selectedAlbum) {
      setAlbums(prev => prev.map(album => 
        album.id === selectedAlbum.id ? { ...album, ...newAlbum } : album
      ));
    } else {
      setAlbums(prev => [...prev, { ...newAlbum, id: Date.now() }]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Album Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your music albums collection
              </p>
            </div>
            <button
              onClick={handleAddAlbum}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Album
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No albums</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new album.</p>
            <div className="mt-6">
              <button
                onClick={handleAddAlbum}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Album
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-48 bg-gray-200">
                  {album.imageUrl ? (
                    <img
                      src={album.imageUrl}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      album.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {album.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {album.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <AlbumForm
          album={selectedAlbum}
          onClose={() => {
            setShowForm(false);
            setSelectedAlbum(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default AlbumManagement;