import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, X, Save, Image, Music, Loader2, AlertCircle } from 'lucide-react';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../../api/api';

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
      if (album.imageUrl || album.image) {
        setImagePreview(album.imageUrl || album.image);
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

      if (album) {
        await updateAlbum(album._id || album.id, formDataToSend);
      } else {
        await createAlbum(formDataToSend);
      }

      await onSubmit();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {album ? 'Edit Album' : 'Add New Album'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Album Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                placeholder="Hip hop 79"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm resize-none"
                placeholder="Hip hop songs for diwali"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Album Cover Image {!album && '*'}
              </label>
              <div className="mt-1">
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-purple-100 rounded-full mb-3">
                        <Upload className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
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

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                Set album as active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {album ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {album ? 'Update Album' : 'Create Album'}
                </>
              )}
            </button>
          </div>
        </div>
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

  const fetchAlbums = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAlbums();
      const albumsArray = response?.data?.data || response?.data || [];
      
      console.log('API Response:', response);
      console.log('Extracted Albums:', albumsArray);
      
      setAlbums(Array.isArray(albumsArray) ? albumsArray : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load albums');
      console.error('Error fetching albums:', err);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
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
    if (!window.confirm('Are you sure you want to delete this album?')) {
      return;
    }

    try {
      await deleteAlbum(albumId);
      await fetchAlbums();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete album');
      console.error('Error deleting album:', err);
    }
  };

  const handleFormSubmit = async () => {
    await fetchAlbums();
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold mb-2">Album Management</h1>
              <p className="text-white/80 text-lg">Manage your music albums collection</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span className="font-semibold">{albums.length} Albums</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {albums.filter(a => a.isActive).length} Active
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddAlbum}
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Add Album
            </button>
          </div>
        </div>
        
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error Loading Albums</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchAlbums}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading albums...</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
              <Image className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No albums yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first album.</p>
            <button
              onClick={handleAddAlbum}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2 mx-auto shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create First Album
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album._id || album.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300"
              >
                <div className="relative h-56 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                  {(album.imageUrl || album.image) ? (
                    <img
                      src={album.imageUrl || album.image}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-20 h-20 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                      album.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {album.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {album.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAlbum(album)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-purple-400 transition-colors font-medium"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album._id || album.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md"
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